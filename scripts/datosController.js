var WatchDogApp = angular.module('WatchDogApp', ['ngMaterial']);
WatchDogApp.controller('DataController', ['$scope', function ($scope) {
    $scope.activeSession = false;
    $scope.session = localStorage.getItem("watch_dog_session");

    if ($scope.session) {
        $scope.session = JSON.parse($scope.session);
        $scope.activeSession = true;

        // datos controlador






    } else {
        api.getSession(function (credentials, server) {
            localStorage.setItem("watch_dog_session", JSON.stringify(api));
            api = api;
        });
    }

}]);