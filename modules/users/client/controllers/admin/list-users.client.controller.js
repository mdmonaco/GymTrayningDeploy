(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'Authentication'];

  function UserListController($scope, $filter, AdminService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    var i = 0;
    var temp = [];

    AdminService.query(function (data) {
      vm.users = data;
      if (vm.authentication.user.roles == 'admin') {
        vm.buildPager();  
      } else {
        for (i = 0; i < vm.users.length; i++) {
          if (vm.users[i].roles == 'client') {
            temp.push(vm.users[i]);
          }
        }
        vm.users.length = 0;
        vm.users = temp;
        vm.buildPager();  
      }
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
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
