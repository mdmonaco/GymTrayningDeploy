(function () {
  'use strict';

  angular
    .module('cobros')
    .controller('CobrosListController', CobrosListController);

  CobrosListController.$inject = ['CobrosService'];

  function CobrosListController(CobrosService) {
    var vm = this;

    vm.cobros = CobrosService.query();
  }
}());
