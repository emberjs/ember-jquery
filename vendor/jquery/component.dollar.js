import { assert, deprecate } from '@ember/debug';

(function() {
  Ember.Component.reopen({
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
          until: '4.0.0',
          url: 'https://emberjs.com/deprecations/v3.x#toc_jquery-apis',
        }
      );

      if (this.element) {
        return sel ? jQuery(sel, this.element) : jQuery(this.element);
      }
    }
  });
})();
