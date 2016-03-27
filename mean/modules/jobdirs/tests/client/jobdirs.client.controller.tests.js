(function () {
  'use strict';

  describe('Jobdirs Controller Tests', function () {
    // Initialize global variables
    var JobdirsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      JobdirsService,
      mockJobdir;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _JobdirsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      JobdirsService = _JobdirsService_;

      // create mock Jobdir
      mockJobdir = new JobdirsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Jobdir Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Jobdirs controller.
      JobdirsController = $controller('JobdirsController as vm', {
        $scope: $scope,
        jobdirResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleJobdirPostData;

      beforeEach(function () {
        // Create a sample Jobdir object
        sampleJobdirPostData = new JobdirsService({
          name: 'Jobdir Name'
        });

        $scope.vm.jobdir = sampleJobdirPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (JobdirsService) {
        // Set POST response
        $httpBackend.expectPOST('api/jobdirs', sampleJobdirPostData).respond(mockJobdir);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Jobdir was created
        expect($state.go).toHaveBeenCalledWith('jobdirs.view', {
          jobdirId: mockJobdir._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/jobdirs', sampleJobdirPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Jobdir in $scope
        $scope.vm.jobdir = mockJobdir;
      });

      it('should update a valid Jobdir', inject(function (JobdirsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/jobdirs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('jobdirs.view', {
          jobdirId: mockJobdir._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (JobdirsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/jobdirs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Jobdirs
        $scope.vm.jobdir = mockJobdir;
      });

      it('should delete the Jobdir and redirect to Jobdirs', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/jobdirs\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('jobdirs.list');
      });

      it('should should not delete the Jobdir and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
