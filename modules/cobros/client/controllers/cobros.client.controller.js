(function () {
  'use strict';

  // Cobros controller
  angular
    .module('cobros')
    .controller('CobrosController', CobrosController);

  CobrosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'cobroResolve'];

  function CobrosController ($scope, $state, $window, Authentication, cobroResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cobro = cobroResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cobro
    function remove() {
      if ($window.confirm('¿Está seguro que desea eliminar la Disciplina?')) {
        vm.cobro.$remove($state.go('cobros.list'));
      }
    }

    // Save Cobro
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cobroForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cobro._id) {
        vm.cobro.$update(successCallback, errorCallback);
      } else {
        vm.cobro.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cobros.view', {
          cobroId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
