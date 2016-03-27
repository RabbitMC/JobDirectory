'use strict';

describe('Jobdirs E2E Tests:', function () {
  describe('Test Jobdirs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/jobdirs');
      expect(element.all(by.repeater('jobdir in jobdirs')).count()).toEqual(0);
    });
  });
});
