'use strict';

module.exports = {
  name: '@ember/jquery',
  included() {
    this._super.included.apply(this, arguments);
    let app = this._findHost();
    let optionalFeatures = app.project.findAddonByName("@ember/optional-features");

    if (!app.vendorFiles || !app.vendorFiles['jquery.js']) {
      app.import('vendor/jquery/jquery.js', { prepend: true });
    }

    if (optionalFeatures && !optionalFeatures.isFeatureEnabled('jquery-integration')) {
      app.project.ui.writeDeprecateLine('You have disabled the `jquery-integration` optional feature. You now have to delete `@ember/jquery` from your package.json');
    }
  },

  treeForVendor: function() {
    const Funnel = require('broccoli-funnel');
    const resolve = require('resolve');
    const path = require('path');

    var jqueryPath;
    try {
      jqueryPath = path.dirname(
        resolve.sync('jquery/package.json', { basedir: this.project.root })
      );
    } catch (error) {
      jqueryPath = path.dirname(require.resolve('jquery/package.json'));
    }

    var jquery = new Funnel(jqueryPath + '/dist', {
      destDir: 'jquery',
      files: ['jquery.js'],
    });

    return jquery;
  },
};
