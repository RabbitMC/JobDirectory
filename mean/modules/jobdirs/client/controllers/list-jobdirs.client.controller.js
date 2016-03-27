(function () {
  'use strict';

  angular
    .module('jobdirs')
    .controller('JobdirsListController', JobdirsListController);

  JobdirsListController.$inject = ['JobdirsService'];

  function JobdirsListController(JobdirsService) {
    var vm = this;

    vm.jobdirs = JobdirsService.query();
  }
})();
