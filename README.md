ember-jquery
==============================================================================

Ember has been historically coupled to jQuery. As part of 
[RFC294](https://github.com/emberjs/rfcs/blob/master/text/0294-optional-jquery.md#introduce-emberjquery-package),
jQuery has been made optional. 

This addon makes jQuery available in an Ember project. It also provides the mechanism that implements jQuery 
integration when that feature is enabled. 


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install @ember/jquery
```

If you also wish to enable Ember's jQuery integration, you must do so explicitly:

```bash
ember install @ember/optional-features
ember feature:enable jquery-integration
``` 

Usage
------------------------------------------------------------------------------

```js
import jQuery from 'jquery'
const element = jQuery('#special');
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
