'use strict';

describe('Cobros E2E Tests:', function () {
  describe('Test Cobros page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cobros');
      expect(element.all(by.repeater('cobro in cobros')).count()).toEqual(0);
    });
  });
});
