(function () {
  'use strict';

  angular
    .module('pagos')
    .controller('PagosListController', PagosListController);

  PagosListController.$inject = ['PagosService', '$scope', '$filter', 'Authentication'];

  function PagosListController(PagosService, $scope , $filter, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    PagosService.query(function (data) {
    	vm.pagos = data;
    	vm.search = new Date(2000,0,1)
    	vm.searchTo = new Date()
    	vm.buildPager();  
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

   	function figureOutItemsToDisplay() {
      // vm.filteredItems = $filter('filter')(vm.pagos, {
      //   $: vm.search
      // });
      vm.filteredItems = vm.pagos.filter((item)=>{
      	var created = new Date(item.created);
		created.setHours(0, 0, 0, 0);
		var search = new Date(vm.search);
		search.setHours(0, 0, 0, 0);
		var searchTo = new Date(vm.searchTo);
		searchTo.setHours(0, 0, 0, 0);
		return ((created.getTime() >= search.getTime()) && (created.getTime() <= searchTo.getTime()))
      })
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());
