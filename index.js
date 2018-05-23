'use strict';

module.exports = {
  name: 'ember-jquery',
  included() {
    this._super.included.apply(this, arguments);
    let optionalFeatures = app.project.findAddonByName("@ember/optional-features");
    let app = this._findHost();
    app.import('vendor/jquery.js', { prepend: true });
    if (optionalFeatures && optionalFeatures.isFeatureEnabled('jquery-integration')) {
      app.project.ui.writeDeprecateLine('You have disabled the `jquery-integration` optional feature. You now have to delete `@ember/jquery` from your package.json');
    }
  }
};
