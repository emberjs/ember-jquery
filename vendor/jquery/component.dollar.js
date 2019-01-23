Ember.Component.reopen({
  $(sel) {
    Ember.assert(
      "You cannot access this.$() on a component with `tagName: ''` specified.",
      this.tagName !== ''
    );

    if (this.element) {
      return sel ? jQuery(sel, this.element) : jQuery(this.element);
    }
  }
});
