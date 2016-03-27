(function () {
  'use strict';

  // Jobdirs controller
  angular
    .module('jobdirs')
    .controller('JobdirsController', JobdirsController);

  JobdirsController.$inject = ['$scope', '$state', 'Authentication', 'jobdirResolve'];

  function JobdirsController ($scope, $state, Authentication, jobdir) {
    var vm = this;

    vm.authentication = Authentication;
    vm.jobdir = jobdir;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Jobdir
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.jobdir.$remove($state.go('jobdirs.list'));
      }
    }

    // Save Jobdir
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.jobdirForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.jobdir._id) {
        vm.jobdir.$update(successCallback, errorCallback);
      } else {
        vm.jobdir.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('jobdirs.view', {
          jobdirId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
