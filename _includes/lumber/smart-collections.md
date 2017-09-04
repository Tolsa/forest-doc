# Smart Collections

Forest is able to render your data models to its customizable UI. It covers the
majority of use cases. If needed, you can create a Smart Collection to go one step
further in the customization of your admin. A Smart Collection is a Forest Collection
based on your API implementation. Reports or aggregated tables are two of the
most common use cases.

## Creating a Smart Collection

In the following example, the application has one table `Item`. Each item has a
`brand` field (`String`). We create a collection `Brand` that contains each
brand and their corresponding number of items.

Forest uses the <a href="http://jsonapi.org" target="_blank">JSON API</a>
standard. Your Smart Collection implementation should return a valid JSON API
payload. You can do it manually or use <a
href="http://jsonapi.org/implementations" target="_blank">the library you
want</a>. The following examples show you how to do it manually.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Collection</h2>
    <p class="l-step__description">/forest/brands.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-sequelize');

Liana.collection('brands', {
  fields: [
    { field: 'brand', type: 'String' },
    { field: 'count', type: 'Number' }
  ]
});
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Create the route in the routes/ directory</p>
  </div>
</div>

```javascript
var express = require('express');
var router = express.router();
var Liana = require('forest-express-sequelize');
var models = require('../models');

router.get('/forest/brands', Liana.ensureAuthenticated, function (req, res) {
  // Your business logic here to retrieve the data you want.
  .then(function (values) {
    values = values.map(function (value, index) {
      return {
        id: index,
        type: 'brands',
        attributes: {
          brand: value.brand,
          count: value.count
        }
      };
    });

    res.send({ data: values });
  });
});

module.exports = router;
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The Smart Collection will appear in the navigation bar.</p>
  </div>
</div>
