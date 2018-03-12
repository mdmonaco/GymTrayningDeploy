(function () {
  'use strict';

  describe('Cobros Route Tests', function () {
    // Initialize global variables
    var $scope,
      CobrosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CobrosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CobrosService = _CobrosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cobros');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cobros');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CobrosController,
          mockCobro;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cobros.view');
          $templateCache.put('modules/cobros/client/views/view-cobro.client.view.html', '');

          // create mock Cobro
          mockCobro = new CobrosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cobro Name'
          });

          // Initialize Controller
          CobrosController = $controller('CobrosController as vm', {
            $scope: $scope,
            cobroResolve: mockCobro
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cobroId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cobroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cobroId: 1
          })).toEqual('/cobros/1');
        }));

        it('should attach an Cobro to the controller scope', function () {
          expect($scope.vm.cobro._id).toBe(mockCobro._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cobros/client/views/view-cobro.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CobrosController,
          mockCobro;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cobros.create');
          $templateCache.put('modules/cobros/client/views/form-cobro.client.view.html', '');

          // create mock Cobro
          mockCobro = new CobrosService();

          // Initialize Controller
          CobrosController = $controller('CobrosController as vm', {
            $scope: $scope,
            cobroResolve: mockCobro
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cobroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cobros/create');
        }));

        it('should attach an Cobro to the controller scope', function () {
          expect($scope.vm.cobro._id).toBe(mockCobro._id);
          expect($scope.vm.cobro._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cobros/client/views/form-cobro.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CobrosController,
          mockCobro;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cobros.edit');
          $templateCache.put('modules/cobros/client/views/form-cobro.client.view.html', '');

          // create mock Cobro
          mockCobro = new CobrosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Cobro Name'
          });

          // Initialize Controller
          CobrosController = $controller('CobrosController as vm', {
            $scope: $scope,
            cobroResolve: mockCobro
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cobroId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cobroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cobroId: 1
          })).toEqual('/cobros/1/edit');
        }));

        it('should attach an Cobro to the controller scope', function () {
          expect($scope.vm.cobro._id).toBe(mockCobro._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cobros/client/views/form-cobro.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
