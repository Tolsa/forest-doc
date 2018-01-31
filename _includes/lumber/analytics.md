# Analytics

As an admin user, KPIs are one of the most important things to follow day by
day. Your customers' growth, Monthly Recurring Revenue (MRR), Paid VS Free
accounts are some common examples.

Forest can render three types of charts:

- Single value (Number of users, MRR, ...)
- Repartition (Number of users by countries, Paid VS Free, ...)
- Time-based (Number of signups per month, ...)

Ensure you've enabled the `Edit Layout` mode to add, edit or delete a chart.

## Creating a Chart

Forest provides a straightforward UI to configure the charts you want.

### Simple mode

The only information the UI needs to handle such charts is:

- 1 collection
- 1 aggregate function (count, sum, ...)
- 1 group by field
- 1 time frame (day, week, month, year) option.
- 1 or multiple filters.

![Analytics 1`](/public/img/analytics-1.png)

### Query mode
<span class="l-category l-category__pro">Premium feature</span>

The Query mode has been designed to provide you with a flexible, easy to use
and accessible interface when hard questions need to be answered. Simply type
SQL queries using the online editor and visualize your data graphically.

![Analytics 7`](/public/img/analytics-7.png)

<div class='c-notice info l-mt l-mb'>
  The syntax of the SQL examples below can be different depending on the
  database type (SQLite, MySQL, Postgres, MS SQL, etc.). Please, refer to your
  database documentation for more information.
</div>

#### Single value

The returned column must be name **value**. In the following example, we simply
count the number of "customers".

```sql
SELECT COUNT(*) AS value
FROM customers;
```

<br>

#### Single value (with growth percentage)

The returned columns must be name `value` and `previous`. In the following
example, we simply count the number of "customers" in January 2018 and compare
this value to the number of "customers" in the previous month.

```sql
SELECT current.count AS value, previous.count AS previous
FROM (
  SELECT COUNT(*)
  FROM customers
  WHERE created_at BETWEEN '2018-01-01' AND '2018-02-01'
) as current, (
  SELECT COUNT(*)
  FROM customers
  WHERE created_at BETWEEN '2017-12-01' AND '2018-01-01'
) as previous;
```

<br>

#### Repartition

The returned columns must be name `key` and `value`. In the following example,
we simply count the number of "customers" distributed by country.

```sql
SELECT country AS key, COUNT(*) as value
FROM "customers"
GROUP BY country;
```

<br>

#### Time-based

The returned columns must be name `key` and `value`. In the following
example, we simply count the number of "customers" per month.

```sql
SELECT DATE_TRUNC('month', "createdAt") AS key, COUNT(*) as value
FROM customers
GROUP BY created_at;
```

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
var router = express.Router();
var liana = require('forest-express-sequelize');

function mrr(req, res) {
  var result = 500000; // Your business logic here.

  // The liana.StatSerializer function serializes the result to a valid
  // JSONAPI payload.
  var json = new liana.StatSerializer({ value: result }).perform();
  res.send(json);
}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/stats/mrr', liana.ensureAuthenticated, mrr);

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
var router = express.Router();
var liana = require('forest-express-sequelize');
var models = require('../models');

function orderPriceRepartition(req, res) {
  // Your business logic here.
  var query = `
SELECT range, COUNT(*) norders
FROM (
  SELECT CASE WHEN SUM(products.price) > 70 THEN '> $70'
    WHEN SUM(products.price) > 40 THEN '> $40'
    WHEN SUM(products.price) > 20 THEN '> $20'
    WHEN SUM(products.price) > 10 THEN '> $10'
    ELSE '<= $10'
  END as range
  FROM orders_products
  JOIN orders ON orders.id = orders_products.order_id
  JOIN products ON products.id = orders_products.product_id
  GROUP BY orders.id
) f
GROUP BY range
ORDER BY CASE WHEN range = '<= $10' THEN 1
  WHEN range = '> $10' THEN 2
  WHEN range = '> $20' THEN 3
  WHEN range = '> $40' THEN 4
  WHEN range = '> $70' THEN 5
END
`;

  return models.sequelize
    .query(query, {
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(function (result) {
      return result.map(function (r) {
        return {
          key: r.range,
          value: r.norders
        };
      });
    })
    .then(function (result) {
      // The liana.StatSerializer function serializes the result to a valid
      // JSONAPI payload.
      var json = new liana.StatSerializer({ value: result }).perform();
      res.send(json);
    });
}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/stats/order_price_repartition', liana.ensureAuthenticated, orderPriceRepartition);

module.exports = router;

```

![repartition chart](/public/img/analytics-3.png "Repartition chart")

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
var router = express.Router();
var liana = require('forest-express-sequelize');
var models = require('../models');

function mrrOverMonth(req, res) {
  // Your business logic here.
  var result = [{
    label: '2017-01',
    values: { value: 100000 }
  }, {
    label: '2017-02',
    values: { value: 150000 }
  }, {
    label: '2017-03',
    values: { value: 180000 }
  }, {
    label: '2017-04',
    values: { value: 250000 }
  }, {
    label: '2017-06',
    values: { value: 350000 }
  }, {
    label: '2017-07',
    values: { value: 400000 }
  }, {
    label: '2017-08',
    values: { value: 500000 }
  }];

  // The liana.StatSerializer function serializes the result to a valid
  // JSONAPI payload.
  var json = new liana.StatSerializer({ value: result }).perform();
  res.send(json);
}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/stats/mrr_over_month', liana.ensureAuthenticated, mrrOverMonth);

module.exports = router;

```

![time based chart](/public/img/analytics-4.png "Time based chart")

## Creating analytics per record

Forest’s dashboard is handy when it comes to monitoring the overall KPIs. But
you may find the analytics module useful for a more in-depth examination of a
specific company, user or any other items.

![Analytics 6`](/public/img/analytics-6.png)

"Analytics per record" only supports Smart Charts. The parameter `record_id` is
automatically passed in the HTTP body to access the record the user is
currently seeing.
