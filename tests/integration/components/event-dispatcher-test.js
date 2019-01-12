import QUnit, { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, focus, blur } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';
import jQuery from 'jquery';

function assertJqEvent(event) {
  let assert = QUnit.assert;
  assert.ok(event, 'event was fired!');
  assert.ok(event instanceof jQuery.Event, 'event is a jQuery event');
  assert.ok(event.originalEvent, 'event has originalEvent');
}

module('Integration | EventDispatcher', function(hooks) {
  setupRenderingTest(hooks);

  test('a component can handle the click event', async function(assert) {
    assert.expect(3);

    this.owner.register('component:handles-click', Component.extend({
      click(e) {
        assertJqEvent(e);
      }
    }));
    this.owner.register('template:components/handles-click', hbs`<button>Click me</button>`);

    await render(hbs`{{handles-click id='clickey'}}`);
    await click('#clickey');
  });

  test('actions are properly looked up when clicked directly', async function(assert) {
    assert.expect(1);

    this.owner.register('component:handles-click', Component.extend({
      actions: {
        handleClick() {
          assert.ok(true, 'click was fired!');
        }
      }
    }));
    this.owner.register('template:components/handles-click', hbs`<button {{action 'handleClick'}}>Click me</button>`);

    await render(hbs`{{handles-click id='clickey'}}`);
    await click('button');
  });

  test('actions are properly looked up when clicking nested contents', async function(assert) {
    assert.expect(1);

    this.owner.register('component:handles-click', Component.extend({
      actions: {
        handleClick() {
          assert.ok(true, 'click was fired!');
        }
      }
    }));
    this.owner.register('template:components/handles-click', hbs`<div {{action 'handleClick'}}><button>Click me</button></div>`);

    await render(hbs`{{handles-click id='clickey'}}`);
    await click('button');
  });

  test('unhandled events do not trigger an error', async function(assert) {
    assert.expect(0);

    await render(hbs`<button>Click Me!</button>`);
    await click('button');
  });

  test('events bubble up', async function(assert) {
    assert.expect(3);

    this.owner.register('component:handles-focusout', Component.extend({
      focusOut(e) {
        assertJqEvent(e);
      }
    }));
    this.owner.register('component:input-element', Component.extend({
      tagName: 'input',

      focusOut() {
      }
    }));

    await render(hbs`{{#handles-focusout}}{{input-element}}{{/handles-focusout}}`);
    await focus('input');
    await blur('input');
  });

  test('events are not stopped by default', async function(assert) {
    assert.expect(4);

    this.set('submit', (e) => {
      e.preventDefault();
      assert.ok('submit was fired!');
    });

    this.owner.register('component:submit-button', Component.extend({
      tagName: 'button',
      attributeBindings: ['type'],
      type: 'submit',
      click(e) {
        assertJqEvent(e);
      }
    }));

    await render(hbs`<form onsubmit={{action submit}}>{{submit-button}}</form>`);
    await click('button');
  });

  test('events are stopped when returning false from view handler', async function(assert) {
    assert.expect(3);

    this.set('submit', (e) => {
      e.preventDefault();
      assert.notOk(true, 'submit should not be fired!');
    });

    this.owner.register('component:submit-button', Component.extend({
      tagName: 'button',
      attributeBindings: ['type'],
      type: 'submit',
      click(e) {
        assertJqEvent(e);
        return false;
      }
    }));

    await render(hbs`<form onsubmit={{action submit}}>{{submit-button}}</form>`);
    await click('button');
  });
});
