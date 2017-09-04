# Dashboard

As an admin user, KPIs are one of the most important things to follow day by
day. Your customers' growth, Monthly Recurring Revenue (MRR), Paid VS Free
accounts are some common examples.

Forest can render three types of charts:

- Single value (Number of users, MRR, ...)
- Repartition (Number of users by countries, Paid VS Free, ...)
- Time-based (Number of signups per month, ...)

Ensure you've enabled the `Edit Layout` mode to add, edit or delete a chart.

## Creating a Chart

Forest provides a straightforward UI to configure step-by-step the charts you
want. The only information the UI needs to handle such charts is:

- 1 collection
- 1 aggregate function (count, sum, ...)
- 1 group by field
- 1 time frame (day, week, month, year) option.

![Analytics 1`](/public/img/analytics-1.png)

## Creating a Smart Chart

Sometimes, charts data are complicated and closely tied to your business.
Forest allows you to code how the chart is computed. Choose "URL" as the
data source when configuring your chart. Forest will make the HTTP call to
this address when retrieving the chart values for the rendering.

![Analytics 2`](/public/img/analytics-2.png)

## Value chart

The `value` format passed to the serializer for a Value chart must be:

```
<value>
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Create the route in the routes/ directory</p>
  </div>
</div>

```javascript
var express = require('express');
var router = express.router();
var liana = require('forest-express-sequelize');

function mrr(req, res) {
  var result = 500000; // Your business logic here.

  // The liana.StatSerializer function serializes the result to a valid
  // JSONAPI payload.
  var json = new liana.StatSerializer({ value: result }).perform();
  res.send(json);
}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/api/stats/mrr', liana.ensureAuthenticated, mrr);

module.exports = router;
```

## Repartition chart

The `value` format passed to the serializer for a Repartition chart must be:

```
[
  { key: <key>, value: <value> },
  { key: <key>, value: <value> },
  ...
]
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Create the route in the routes/ directory</p>
  </div>
</div>

```javascript
var express = require('express');
var router = express.router();
var liana = require('forest-express-sequelize');

function avgPricePerSupplier(req, res) {
  models.item
    .findAll({
      attributes: [
        'supplier',
        [ db.sequelize.fn('avg', db.sequelize.col('price')), 'value' ]
      ],
      group: ['supplier'],
      order: ['value']
    })
    .then((result) => {
      return result.map((r) => {
        r = r.toJSON();

        var ret = {
          key: r.supplier,
          value: r.value
        };

        return ret;
      });
    })
    .then((result) => {
      var json = new liana.StatSerializer({ value: result }).perform();
      res.send(json);
    });
}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/api/stats/avg_price_per_supplier', liana.ensureAuthenticated,
  avgPricePerSupplier);

module.exports = router;
```

## Time-based chart

The `value` format passed to the serializer for a Line chart must be:

```
[
  { label: <date key>, values: { value: <value> } },
  { label: <date key>, values: { value: <value> } },
  ...
]
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Create the route in the routes/ directory</p>
  </div>
</div>

```javascript
var express = require('express');
var router = express.router();
var liana = require('forest-express-sequelize');

function avgPricePerMonth(req, res) {
  models.item
    .findAll({
      attributes: [
        [ db.sequelize.fn('avg', db.sequelize.col('price')), 'value' ],
        [ db.sequelize.fn('to_char', db.sequelize.fn('date_trunc', 'month',
            db.sequelize.col('createdAt')), 'YYYY-MM-DD 00:00:00'), 'key' ]
      ],
      group: ['key'],
      order: ['key']
    })
    .then((result) => {
      return result.map((r) => {
        r = r.toJSON();

        var ret = {
          label: r.key,
          values: {
            value: r.value
          }
        };

        return ret;
      });
    })
    .then((result) => {
      var json = new liana.StatSerializer({ value: result }).perform();
      res.send(json);
    });

}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/api/stats/avg_price_per_month', liana.ensureAuthenticated,
  avgPricePerMonth);

module.exports = router;
```
