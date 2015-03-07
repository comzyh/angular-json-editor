/**
 * Created by Comzyh on 2015/3/5.
 */

'use strict';

/*
 * An Angular service which helps with creating recursive directives.
 * @author Mark Lagendijk
 * @license MIT
 */
angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function ($compile) {
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function (element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = {post: link};
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function (scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);

angular.module('angularJsonEditor', ['RecursionHelper'])
    .directive('jsonEditor', function (RecursionHelper) {
        return {
            restrict: "E",
            //replace: true,
            scope: {
                content: '=',
                'name': '='
            },
            compile: function (element) {
                // Use the compile function from the RecursionHelper,
                // And return the linking function(s) which it returns
                return RecursionHelper.compile(element);
            },
            //template: '<div></div><ul><li ></li></ul>',
            templateUrl: "../template/angular-json-editor.html",
            controller: ['$scope', function ($scope) {
                $scope.type = (function () {
                    var content = $scope.content;
                    switch (typeof content) {
                        case 'number':
                        case 'boolean':
                        case 'string':
                            return typeof content;
                            break;
                        case 'object':
                            if (Object.prototype.toString.call(content) == '[object Array]')
                                return 'array'
                            if (Object.prototype.toString.call(content) == '[object Date]')
                                return 'date'
                            if (content === null)
                                return 'null'
                            return 'object';
                            break;
                        case 'undefined':
                            return 'undefined';
                            break;
                    }
                })();
                $scope.children = undefined;
                if ( $scope.type == 'array' ||  $scope.type == 'object')
                    $scope.children = $scope.content;
            }
            ]
        }
    }
)
;
//template: '<ul class="tree"><object-editor ng-repeat="(k, v) in content track by $index" object-type="displayType" key="k" value="content"></object-editor></ul>'