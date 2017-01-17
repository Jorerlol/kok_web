"use strict";
module.exports = function ($scope, AuthService,$location) {
    let vm = this;
    vm.user = AuthService.user;

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);

    $scope.$on('$locationChangeStart', function(event,next,current) {
        console.log(next,current);
        console.log($location.path());
    });

    vm.isActive = function(path){
        return ($location.path() === path);
    }

    AuthService.authCheck();

    vm.logout = function() {
        AuthService.logout()
            .catch(err => console.log(err));
    }
}