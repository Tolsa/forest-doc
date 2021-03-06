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

Forest provides a straightforward UI to configure step-by-step the charts you want.
The only information the UI needs to handle such charts is:

- 1 collection
- 1 aggregate function (count, sum, ...)
- 1 group by field
- 1 time frame (day, week, month, year) option.
- 1 or multiple filters.

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
    <p class="l-step__description">Declare the route in the Express Router</p>
  </div>
</div>

```javascript
var liana = require('forest-express-mongoose');

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
var liana = require('forest-express-mongoose');

function avgPricePerSupplier(req, res) {
  // Your business logic here.
  Item
    .aggregate()
    .group({
      _id: '$supplier',
      count: { $avg: '$price' }
    })
    .project({
      key: '$_id',
      value: '$count',
      _id: false
    })
    .exec(function (err, value) {
      // The liana.StatSerializer function serializes the result to a valid
      // JSONAPI payload.
      var json = new liana.StatSerializer({ value: value }).perform();
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
var liana = require('forest-express-mongoose');

function avgPricePerMonth(req, res) {
  // Your business logic here.
  Item
    .aggregate()
    .group({
      _id: {
        month: { $month: '$createdAt' },
        year: { $year: '$createdAt' }
      },
      createdAt: { '$last': '$createdAt' },
      count: { $avg: '$price' }
    })
    .sort({
      createdAt: 1
    })
    .project({
      label: '$createdAt',
      values: { value: '$count' },
      _id: false
    })
    .exec(function (err, value) {
      // The liana.StatSerializer function serializes the result to a valid
      // JSONAPI payload.
      var json = new liana.StatSerializer({ value: value }).perform();
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
