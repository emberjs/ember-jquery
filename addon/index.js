import { getOwner } from '@ember/application';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { get, set } from '@ember/object';
import Ember from 'ember';
import jQuery from 'jquery';

const ActionManager = Ember.__loader.require('@ember/-internals/views/lib/system/action_manager').default;

const ROOT_ELEMENT_CLASS = 'ember-application';
const ROOT_ELEMENT_SELECTOR = `.${ROOT_ELEMENT_CLASS}`;

export default Ember.EventDispatcher.extend({

  rootElement: 'body',

  init() {
    this._super();

    assert(
      'EventDispatcher should never be instantiated in fastboot mode. Please report this as an Ember bug.',
      (() => {
        let owner = getOwner(this);
        let environment = owner.lookup('-environment:main');

        return environment.isInteractive;
      })()
    );

    this._eventHandlers = Object.create(null);
  },

  setup(addedEvents, _rootElement) {
    let events = (this._finalEvents = assign({}, get(this, 'events'), addedEvents));

    if (_rootElement !== undefined && _rootElement !== null) {
      set(this, 'rootElement', _rootElement);
    }

    let rootElementSelector = get(this, 'rootElement');
    let rootElement = jQuery(rootElementSelector);
    assert(
      `You cannot use the same root element (${rootElement.selector ||
      rootElement[0].tagName}) multiple times in an Ember.Application`,
      !rootElement.is(ROOT_ELEMENT_SELECTOR)
    );
    assert(
      'You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application',
      !rootElement.closest(ROOT_ELEMENT_SELECTOR).length
    );
    assert(
      'You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application',
      !rootElement.find(ROOT_ELEMENT_SELECTOR).length
    );

    rootElement.addClass(ROOT_ELEMENT_CLASS);

    if (!rootElement.is(ROOT_ELEMENT_SELECTOR)) {
      throw new TypeError(
        `Unable to add '${ROOT_ELEMENT_CLASS}' class to root element (${rootElement.selector ||
        rootElement[0]
          .tagName}). Make sure you set rootElement to the body or an element in the body.`
      );
    }

    let viewRegistry = this._getViewRegistry();

    for (let event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event], viewRegistry);
      }
    }
  },

  setupHandler(rootElement, event, eventName, viewRegistry) {
    if (eventName === null) {
      return;
    }

    rootElement.on(`${event}.ember`, '.ember-view', function(evt) {
      let view = viewRegistry[this.id];
      let result = true;

      if (view) {
        result = view.handleEvent(eventName, evt);
      }

      return result;
    });

    rootElement.on(`${event}.ember`, '[data-ember-action]', evt => {
      let attributes = evt.currentTarget.attributes;
      let handledActions = [];

      for (let i = 0; i < attributes.length; i++) {
        let attr = attributes.item(i);
        let attrName = attr.name;

        if (attrName.lastIndexOf('data-ember-action-', 0) !== -1) {
          let action = ActionManager.registeredActions[attr.value];

          // We have to check for action here since in some cases, jQuery will trigger
          // an event on `removeChild` (i.e. focusout) after we've already torn down the
          // action handlers for the view.
          if (action && action.eventName === eventName && handledActions.indexOf(action) === -1) {
            action.handler(evt);
            // Action handlers can mutate state which in turn creates new attributes on the element.
            // This effect could cause the `data-ember-action` attribute to shift down and be invoked twice.
            // To avoid this, we keep track of which actions have been handled.
            handledActions.push(action);
          }
        }
      }
    });
  },

  destroy() {
    let rootElementSelector = get(this, 'rootElement');
    let rootElement;
    if (rootElementSelector.nodeType) {
      rootElement = rootElementSelector;
    } else {
      rootElement = document.querySelector(rootElementSelector);
    }

    if (!rootElement) {
      return;
    }

    jQuery(rootElementSelector).off('.ember', '**');

    rootElement.classList.remove(ROOT_ELEMENT_CLASS);

    return this._super(...arguments);
  }
});
