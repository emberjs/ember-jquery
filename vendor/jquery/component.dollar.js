import Component from '@ember/component';
import jQuery from 'jquery';
import { assert } from '@ember/debug';

Component.reopen({
  $(sel) {
    assert(
      "You cannot access this.$() on a component with `tagName: ''` specified.",
      this.tagName !== ''
    );

    if (this.element) {
      return sel ? jQuery(sel, this.element) : jQuery(this.element);
    }
  }
});
