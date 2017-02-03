"use strict";

module.exports = function ($scope, Upload, AuthService) {
    let vm = this;
    vm.user = AuthService.user;

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);

    vm.uploadImage = function () {
        if (vm.file && vm.user && vm.user.level >= 1) {
            vm.file.upload = Upload.upload({
                url: '/api/uploads/gallery',
                method: 'POST',
                data: { file: vm.file, title: vm.title, email: vm.user.email }
            });

            vm.file.upload.then(function (response) {
                // $timeout(function () {
                //     vm.file.result = response.data;
                // });
                vm.file = null;
                vm.title = "";
                vm.image = null;
            }, function (response) {
                if (response.status > 0) { }
                vm.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                vm.file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }

    vm.browseImage = function (file, errFiles) {
        vm.file = file;
        vm.errFile = errFiles && errFiles[0];
    }
}