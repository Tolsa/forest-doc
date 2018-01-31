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

## What is a Smart Chart?

Sometimes, charts data are complicated and closely tied to your business.
Forest allows you to code how the chart is computed.

![Analytics 5`](/public/img/analytics-5.png)

## Creating a Smart Chart

Choose "URL" as the data source when configuring your chart. Forest will make
the HTTP call to this address when retrieving the chart values for the
rendering.

![Analytics 2`](/public/img/analytics-2.png)

## Smart "value" Chart

The `value` format passed to the serializer for a Value chart must be:

```
<value>
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb (add the route before the Forest engine)</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/stats/mrr' => 'stats#mrr'
end

# ...
# mount ForestLiana::Engine => '/forest'
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Configure CORS</h2>
    <p class="l-step__description">config/application.rb</p>
  </div>
</div>

We use the gem [rack-cors](https://rubygems.org/gems/rack-cors) for the CORS
configuration.

```ruby
class Application < Rails::Application
  # ...

  config.middleware.insert_before 0, 'Rack::Cors' do
    allow do
      origins 'app.forestadmin.com'
      resource '*', headers: :any, methods: :any
    end
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/stats_controller.rb</p>
  </div>
</div>

```ruby
class StatsController < ForestLiana::ApplicationController
  def mrr
    stat = ForestLiana::Model::Stat.new({
      value: 500000
    })

    render json: serialize_model(stat)
  end
end
```

## Smart "repartition" Chart

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
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb (add the route before the Forest engine)</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/stats/avg_price_per_supplier' => 'stats#avg_price_per_supplier'
end

# ...
# mount ForestLiana::Engine => '/forest'
```


<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Configure CORS</h2>
    <p class="l-step__description">config/application.rb</p>
  </div>
</div>

We use the gem [rack-cors](https://rubygems.org/gems/rack-cors) for the CORS
configuration.

```ruby
class Application < Rails::Application
  # ...

  config.middleware.insert_before 0, 'Rack::Cors' do
    allow do
      origins 'app.forestadmin.com'
      resource '*', headers: :any, methods: :any
    end
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/stats_controller.rb</p>
  </div>
</div>

```ruby
# ForestLiana::ApplicationController takes care of the authentication for you.
class StatsController < ForestLiana::ApplicationController
  def avg_price_per_supplier
    # Your business logic here.
    value = Item
      .all
      .group(:supplier)
      .average(:price)
      .map {|supplier, avg| { key: supplier.last_name, value: avg }}

    stat = ForestLiana::Model::Stat.new({
      value: value
    })

    # The serializer_model function serializes the ForestLiana::Model::Stat
    # model to a valid JSONAPI payload.
    render json: serialize_model(stat)
  end
end
```

## Smart "time-based" chart

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
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb (add the route before the Forest engine)</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/stats/avg_price_per_month' => 'stats#avg_price_per_month'
end

# ...
# mount ForestLiana::Engine => '/forest'
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Configure CORS</h2>
    <p class="l-step__description">config/application.rb</p>
  </div>
</div>

We use the gem [rack-cors](https://rubygems.org/gems/rack-cors) for the CORS
configuration.

```ruby
class Application < Rails::Application
  # ...

  config.middleware.insert_before 0, 'Rack::Cors' do
    allow do
      origins 'app.forestadmin.com'
      resource '*', headers: :any, methods: :any
    end
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/stats_controller.rb</p>
  </div>
</div>

```ruby
# ForestLiana::ApplicationController takes care of the authentication for you.
class StatsController < ForestLiana::ApplicationController
  def avg_price_per_month
    # Your business logic here.
    value = Item
      .all
      .group("DATE_TRUNC('month', created_at)")
      .average(:price)
      .map do |date, avg|
        {
          label: date,
          values: { value: avg }
        }
      end
      .sort_by {|x| x[:label]}

    stat = ForestLiana::Model::Stat.new({
      value: value
    })

    # The serializer_model function serializes the ForestLiana::Model::Stat
    # model to a valid JSONAPI payload.
    render json: serialize_model(stat)
  end
end
```

## Creating analytics per record

Forest’s dashboard is handy when it comes to monitoring the overall KPIs. But
you may find the analytics module useful for a more in-depth examination of a
specific company, user or any other items.

![Analytics 6`](/public/img/analytics-6.png)

"Analytics per record" only supports Smart Charts. The parameter `record_id` is
automatically passed in the HTTP body to access the record the user is
currently seeing.
