# Collections

## What is a collection?

A collection is a set of data elements physically stored in the database
displayed in tabular form (by default), with rows (i.e. records) and columns
named (i.e. fields). A collection has a specified number of columns, but can
have any number of rows.

Forest automatically analyses your data models and instantly make your
collections available in the Forest UI. It covers the majority of use cases. If
needed, you can create a Smart Collection to go one step further in the
customization of your admin.

## What is a Smart Collection?

A Smart Collection is a Forest Collection based on your API implementation. It
allows you to reconciliate fields of data coming from different or external
sources in a single tabular view (by default), without having to physically
store them into your database.

Fields of data could be coming from many other sources such as other B2B SaaS
(e.g. Zendesk, Salesforce, Stripe), in-memory database, message broker, etc.

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
    <p class="l-step__description">Declare the route to the Express Router</p>
  </div>
</div>

```javascript
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

```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The Smart Collection will appear in the navigation bar.</p>
  </div>
</div>
