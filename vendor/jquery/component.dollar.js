import { assert, deprecate } from '@ember/debug';
import EmberObject from '@ember/object';
import Component from '@ember/component';

(function() {
  /*
   * This non-standard use of `reopen` and `call` allows the component
   * base class to be reopened without triggering the
   * ember.component.reopen deprecation in Ember itself.
   */
  EmberObject.reopen.call(Component, {
    $(sel) {
      assert(
        "You cannot access this.$() on a component with `tagName: ''` specified.",
        this.tagName !== ''
      );

      deprecate(
        'Using this.$() in a component has been deprecated, consider using this.element',
        false,
        {
          id: 'ember-views.curly-components.jquery-element',
          since: '3.4.0',
          until: '4.0.0',
          url: 'https://emberjs.com/deprecations/v3.x#toc_jquery-apis',
          for: 'ember-source',
        }
      );

      if (this.element) {
        return sel ? jQuery(sel, this.element) : jQuery(this.element);
      }
    }
  });
})();
