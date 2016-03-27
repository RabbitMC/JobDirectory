//Jobdirs service used to communicate Jobdirs REST endpoints
(function () {
  'use strict';

  angular
    .module('jobdirs')
    .factory('JobdirsService', JobdirsService);

  JobdirsService.$inject = ['$resource'];

  function JobdirsService($resource) {
    return $resource('api/jobdirs/:jobdirId', {
      jobdirId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
