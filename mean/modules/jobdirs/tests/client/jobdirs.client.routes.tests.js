(function () {
  'use strict';

  describe('Jobdirs Route Tests', function () {
    // Initialize global variables
    var $scope,
      JobdirsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _JobdirsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      JobdirsService = _JobdirsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('jobdirs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/jobdirs');
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
          JobdirsController,
          mockJobdir;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('jobdirs.view');
          $templateCache.put('modules/jobdirs/client/views/view-jobdir.client.view.html', '');

          // create mock Jobdir
          mockJobdir = new JobdirsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Jobdir Name'
          });

          //Initialize Controller
          JobdirsController = $controller('JobdirsController as vm', {
            $scope: $scope,
            jobdirResolve: mockJobdir
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:jobdirId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.jobdirResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            jobdirId: 1
          })).toEqual('/jobdirs/1');
        }));

        it('should attach an Jobdir to the controller scope', function () {
          expect($scope.vm.jobdir._id).toBe(mockJobdir._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/jobdirs/client/views/view-jobdir.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          JobdirsController,
          mockJobdir;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('jobdirs.create');
          $templateCache.put('modules/jobdirs/client/views/form-jobdir.client.view.html', '');

          // create mock Jobdir
          mockJobdir = new JobdirsService();

          //Initialize Controller
          JobdirsController = $controller('JobdirsController as vm', {
            $scope: $scope,
            jobdirResolve: mockJobdir
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.jobdirResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/jobdirs/create');
        }));

        it('should attach an Jobdir to the controller scope', function () {
          expect($scope.vm.jobdir._id).toBe(mockJobdir._id);
          expect($scope.vm.jobdir._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/jobdirs/client/views/form-jobdir.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          JobdirsController,
          mockJobdir;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('jobdirs.edit');
          $templateCache.put('modules/jobdirs/client/views/form-jobdir.client.view.html', '');

          // create mock Jobdir
          mockJobdir = new JobdirsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Jobdir Name'
          });

          //Initialize Controller
          JobdirsController = $controller('JobdirsController as vm', {
            $scope: $scope,
            jobdirResolve: mockJobdir
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:jobdirId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.jobdirResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            jobdirId: 1
          })).toEqual('/jobdirs/1/edit');
        }));

        it('should attach an Jobdir to the controller scope', function () {
          expect($scope.vm.jobdir._id).toBe(mockJobdir._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/jobdirs/client/views/form-jobdir.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
