var myApp = angular.module('myApp', ['angularJsonEditor','ngAnimate']);
myApp.controller('MyCtrl', function ($scope) {
    $scope.content = {
        a: 'c',
        b: 'd',
        e: ['xxx', 'yyy',{
            'yangz':'sb',
            'comzyh':'comzyh',
            'age':[3,4,56]
        }]
    }
});