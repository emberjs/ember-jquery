import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@ember/component';
import jQuery from 'jquery';

const component = Component.extend({
  didInsertElement() {
    this.setJQueryElement(this.$(this.get('selector')));
  }
});

module('Integration | Component | component-dot-dollar', function(hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function() {
    this.owner.register('component:jquery-component', component);
    this.$element = null;
    this.setJQueryElement = ($) => this.$element = $;
  });

  test('it implements Component.$()', async function(assert) {
    await render(hbs`{{jquery-component id="jq" setJQueryElement=setJQueryElement}}`);

    assert.ok(this.$element, 'Component.$() is available');
    assert.ok(this.$element instanceof jQuery, 'Component.$() returns a jQuery object');
    assert.equal(this.$element.get(0), this.element.querySelector('#jq'), 'Component.$() is a jQuery wrapper around Component.element');
  });

  test('it implements Component.$(selector)', async function(assert) {
    await render(hbs`{{#jquery-component id="jq" selector="div" setJQueryElement=setJQueryElement}}<div id="child"/>{{/jquery-component}}`);

    assert.equal(this.$element.get(0), this.element.querySelector('#child'), 'Component.$(selector) is a jQuery object of the child elements matching selector');
  });
});
