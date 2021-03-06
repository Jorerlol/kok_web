"use strict";

module.exports = function ($scope, $rootScope, Upload, AuthService) {
    let vm = this;
    vm.user = AuthService.user;

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);

    vm.uploadImage = function () {
        vm.uploadState = "loading";
        if (vm.file && vm.user && vm.user.level >= 1) {
            vm.file.upload = Upload.upload({
                url: '/api/uploads/gallery',
                method: 'POST',
                data: { file: vm.file, title: vm.title, email: vm.user.email }
            });

            vm.file.upload.then(function (response) {
                $rootScope.$broadcast('fileProcessed');
                vm.file = null;
                vm.title = "";
                vm.image = null;
                $scope.uploadForm.$setPristine();
                vm.uploadState = "success";
            }, function (response) {
                if (response.status > 0) { }
                vm.errorMsg = response.status + ': ' + response.data;
                vm.uploadState = "fail";
            }, function (evt) {
                vm.file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        } else {
            vm.uploadState = "fail";
        }
    }

    vm.browseImage = function (file, errFiles) {
        vm.file = file;
        vm.errFile = errFiles && errFiles[0];
    }
}