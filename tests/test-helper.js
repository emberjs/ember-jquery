import QUnit from 'qunit';
import { registerDeprecationHandler } from '@ember/debug';
import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

let deprecations;

registerDeprecationHandler((message, options, next) => {
  // in case a deprecation is issued before a test is started
  if (!deprecations) {
    deprecations = [];
  }

  deprecations.push(message);
  next(message, options);
});

QUnit.testStart(function() {
  deprecations = [];
});

QUnit.assert.noDeprecations = async function(callback) {
  let originalDeprecations = deprecations;
  deprecations = [];

  await callback();
  this.deepEqual(deprecations, [], 'Expected no deprecations during test.');

  deprecations = originalDeprecations;
};

setApplication(Application.create(config.APP));

start();
