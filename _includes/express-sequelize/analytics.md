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
    <p class="l-step__description">Declare the route in the Express Router</p>
  </div>
</div>

```javascript
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
    <p class="l-step__description">Declare the route in the Express Router</p>
  </div>
</div>

```javascript
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
    <p class="l-step__description">Declare the route in the Express Router</p>
  </div>
</div>

```javascript
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
```

## Creating analytics per record

Forest’s dashboard is handy when it comes to monitoring the overall KPIs. But
you may find the analytics module useful for a more in-depth examination of a
specific company, user or any other items.

![Analytics 6`](/public/img/analytics-6.png)

"Analytics per record" only supports Smart Charts. The parameter `record_id` is
automatically passed in the HTTP body to access the record the user is
currently seeing.
