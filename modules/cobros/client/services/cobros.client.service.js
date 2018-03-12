// Cobros service used to communicate Cobros REST endpoints
(function () {
  'use strict';

  angular
    .module('cobros')
    .factory('CobrosService', CobrosService);

  CobrosService.$inject = ['$resource'];

  function CobrosService($resource) {
    return $resource('api/cobros/:cobroId', {
      cobroId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
