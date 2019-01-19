(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['jquery'],
      __esModule: true,
    };
  }

  define('jquery', [], vendorModule);
})();
