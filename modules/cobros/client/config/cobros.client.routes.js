(function () {
  'use strict';

  angular
    .module('cobros')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cobros', {
        abstract: true,
        url: '/cobros',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('cobroslist', {
        url: '/cobroslist',
        templateUrl: 'modules/cobros/client/views/list-cobros.client.view.html',
        controller: 'CobrosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cobros List',
          roles: ['user', 'admin']
        }
      })
      .state('cobroscreate', {
        url: '/createcobro',
        templateUrl: 'modules/cobros/client/views/form-cobro.client.view.html',
        controller: 'CobrosController',
        controllerAs: 'vm',
        resolve: {
          cobroResolve: newCobro
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Cobros Create'
        }
      })
      .state('cobrosedit', {
        url: '/:cobroId/edit',
        templateUrl: 'modules/cobros/client/views/form-cobro.client.view.html',
        controller: 'CobrosController',
        controllerAs: 'vm',
        resolve: {
          cobroResolve: getCobro
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cobro {{ cobroResolve.name }}'
        }
      })
      .state('cobros.view', {
        url: '/:cobroId',
        templateUrl: 'modules/cobros/client/views/view-cobro.client.view.html',
        controller: 'CobrosController',
        controllerAs: 'vm',
        resolve: {
          cobroResolve: getCobro
        },
        data: {
          pageTitle: 'Cobro {{ cobroResolve.name }}',
          roles: ['user', 'admin']
        }
      });
  }

  getCobro.$inject = ['$stateParams', 'CobrosService'];

  function getCobro($stateParams, CobrosService) {
    return CobrosService.get({
      cobroId: $stateParams.cobroId
    }).$promise;
  }

  newCobro.$inject = ['CobrosService'];

  function newCobro(CobrosService) {
    return new CobrosService();
  }
}());
