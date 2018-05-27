ember-jquery
==============================================================================

Ember has been historically coupled to jQuery. As part of 
[RFC294](https://github.com/emberjs/rfcs/blob/master/text/0294-optional-jquery.md#introduce-emberjquery-package)
jQuery has been made optional and this addon will explicitly add the jQuery integration functionality.

Installation
------------------------------------------------------------------------------

```
ember install @ember/jquery
```

You should also explicitly tell Ember to enable its jQuery integration:

```bash
ember install @ember/optional-features
ember feature:enable jquery-integration
``` 

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-jquery`
* `yarn install`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
