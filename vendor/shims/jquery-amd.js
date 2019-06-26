(function() {
  function vendorModule() {
    'use strict';
    return self['jQuery']
  }

  define('jquery', [], vendorModule);
})();
