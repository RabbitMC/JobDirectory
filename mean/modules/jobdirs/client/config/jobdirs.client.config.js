(function () {
  'use strict';

  angular
    .module('jobdirs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Jobdirs',
      state: 'jobdirs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'jobdirs', {
      title: 'List Jobdirs',
      state: 'jobdirs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'jobdirs', {
      title: 'Create Jobdir',
      state: 'jobdirs.create',
      roles: ['user']
    });
  }
})();
