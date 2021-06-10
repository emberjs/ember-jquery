import jQuery from 'jquery';
import { module, test } from 'qunit';

module('Unit | import-jquery', function () {
  test('it works', function (assert) {
    assert.equal(jQuery, window.jQuery, 'jQuery shim return global jQuery');
  });
});
