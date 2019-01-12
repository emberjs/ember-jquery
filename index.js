'use strict';

const EMBER_VERSION_WITH_JQUERY_DEPRECATION = '3.9.0-alpha.1';
const EMBER_VERSION_WITHOUT_JQUERY_SUPPORT = '4.0.0-alpha.1';

module.exports = {
  name: require('./package').name,

  init() {
    this._super.init.apply(this, arguments);

    const VersionChecker = require('ember-cli-version-checker');

    let checker = new VersionChecker(this);
    this._ember = checker.forEmber();
  },

  included() {
    this._super.included.apply(this, arguments);

    let app = this._findHost();
    let optionalFeatures = app.project.findAddonByName("@ember/optional-features");

    if (!app.vendorFiles || !app.vendorFiles['jquery.js']) {
      app.import('vendor/jquery/jquery.js', { prepend: true });
    }

    app.import('vendor/shims/jquery.js');

    if (this._ember.gte(EMBER_VERSION_WITH_JQUERY_DEPRECATION)) {
      app.import('vendor/jquery/component.dollar.js');
    }

    if (optionalFeatures && !optionalFeatures.isFeatureEnabled('jquery-integration')) {
      app.project.ui.writeDeprecateLine('You have disabled the `jquery-integration` optional feature. You now have to delete `@ember/jquery` from your package.json');
    }
  },

  treeForAddon() {
    if (this._ember.gte(EMBER_VERSION_WITHOUT_JQUERY_SUPPORT)) {
      return this._super.treeForAddon.apply(this, arguments);
    }
  },

  treeForApp() {
    if (this._ember.gte(EMBER_VERSION_WITHOUT_JQUERY_SUPPORT)) {
      return this._super.treeForApp.apply(this, arguments);
    }
  },

  treeForVendor: function(tree) {
    const BroccoliMergeTrees = require('broccoli-merge-trees');
    const Funnel = require('broccoli-funnel');
    const resolve = require('resolve');
    const path = require('path');

    let jqueryPath;
    try {
      jqueryPath = path.dirname(
        resolve.sync('jquery/package.json', { basedir: this.project.root })
      );
    } catch(error) {
      jqueryPath = path.dirname(require.resolve('jquery/package.json'));
    }

    let jquery = new Funnel(jqueryPath + '/dist', {
      destDir: 'jquery',
      files: ['jquery.js'],
    });

    let babelAddon = this.project.findAddonByName('ember-cli-babel');
    let transpiledTree = babelAddon.transpileTree(tree, {
      'ember-cli-babel': {
        compileModules: false
      }
    });

    return new BroccoliMergeTrees([jquery, transpiledTree]);
  },
};
