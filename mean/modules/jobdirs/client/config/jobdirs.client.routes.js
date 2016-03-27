(function () {
  'use strict';

  angular
    .module('jobdirs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('jobdirs', {
        abstract: true,
        url: '/jobdirs',
        template: '<ui-view/>'
      })
      .state('jobdirs.list', {
        url: '',
        templateUrl: 'modules/jobdirs/client/views/list-jobdirs.client.view.html',
        controller: 'JobdirsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Jobdirs List'
        }
      })
      .state('jobdirs.create', {
        url: '/create',
        templateUrl: 'modules/jobdirs/client/views/form-jobdir.client.view.html',
        controller: 'JobdirsController',
        controllerAs: 'vm',
        resolve: {
          jobdirResolve: newJobdir
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Jobdirs Create'
        }
      })
      .state('jobdirs.edit', {
        url: '/:jobdirId/edit',
        templateUrl: 'modules/jobdirs/client/views/form-jobdir.client.view.html',
        controller: 'JobdirsController',
        controllerAs: 'vm',
        resolve: {
          jobdirResolve: getJobdir
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Jobdir {{ jobdirResolve.name }}'
        }
      })
      .state('jobdirs.view', {
        url: '/:jobdirId',
        templateUrl: 'modules/jobdirs/client/views/view-jobdir.client.view.html',
        controller: 'JobdirsController',
        controllerAs: 'vm',
        resolve: {
          jobdirResolve: getJobdir
        },
        data:{
          pageTitle: 'Jobdir {{ articleResolve.name }}'
        }
      });
  }

  getJobdir.$inject = ['$stateParams', 'JobdirsService'];

  function getJobdir($stateParams, JobdirsService) {
    return JobdirsService.get({
      jobdirId: $stateParams.jobdirId
    }).$promise;
  }

  newJobdir.$inject = ['JobdirsService'];

  function newJobdir(JobdirsService) {
    return new JobdirsService();
  }
})();
