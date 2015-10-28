(function () {
    'use strict';

    packagesController.$inject = ['$scope', '$state', '$stateParams', 'configurationService', 'errorHandler'];
    function packagesController($scope, $state, $stateParams, configurationService, errorHandler) {
        // TODO Make global
        Object.filter = function( obj, predicate) {
            var key;

            for (key in obj) {
                if (obj.hasOwnProperty(key) && predicate(key)) {
                    return obj[key];
                }
            }
        };

        $scope.checked = {};

        configurationService.loadPkg($stateParams.domain).then(
            function (response) {
                $scope.service = response.data[$state.params.service];
                $scope.instances = $scope.service.instances;
                $scope.instances.forEach(function(instance) {
                    $scope.saveAvailableHelper++;
                    $scope.checked[instance] = true;
                });

                if ($state.params.instances) {
                    for (var i in $scope.checked) {
                        $scope.checked[i] = false;
                    }
                    $state.params.instances.split(',').forEach(function(instance){
                        if ($scope.checked[instance] != 'undefined') {
                            $scope.checked[instance] = true;
                            $scope.saveAvailableHelper++;
                        }
                    });
                }

            },
            function (responce) {
                $scope.error = errorHandler.showError(response.data, responce.status);
            }
        );

        $scope.saveAvailableHelper = 0;

        $scope.changeState = function(val) {
            if (val) {
                $scope.saveAvailableHelper++;
            } else {
                $scope.saveAvailableHelper--;
            }
        };

        $scope.show = function() {
            var selectedInstances = [];
            for (var i in $scope.checked) {
                if ($scope.checked[i]) {
                    selectedInstances.push(i);
                }
            }
            if (selectedInstances.length > 0) {
                $state.go('app.configurations.services.state.packages.editor', {instances: selectedInstances});
            }
        }
    }

    angular.module('qorDash.configurations.services.state.packages')
        .controller('PackagesController', packagesController);
})();
