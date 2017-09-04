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

Forest provides a straightforward UI to configure step-by-step the charts you want.
The only information the UI needs to handle such charts is:

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
# ForestLiana::ApplicationController takes care of the authentication for you.
class StatsController < ForestLiana::ApplicationController
  def mrr
    stat = ForestLiana::Model::Stat.new({
      value: 500000 # Your business logic here.
    })

    # The serializer_model function serializes the ForestLiana::Model::Stat
    # model to a valid JSONAPI payload.
    render json: serialize_model(stat)
  end
end
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
