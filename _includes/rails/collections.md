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

In the following example, we create a `Payment` Smart Collection as follows:

<img src="/public/img/smart-collection-1.png" alt="Smart collection"
  class="img--retina">

Forest uses <a href="http://jsonapi.org" target="_blank">JSON API</a> to
serialize payload of API calls. The following example uses <a
href="https://github.com/fotinakis/jsonapi-serializers"
target="_blank">jsonapi-serializers</a> Gem. You can of course use the library
you want or simply serialize your data manually.

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Collection</h2>
    <p class="l-step__description">lib/forest_liana/collections/payment.rb</p>
  </div>
</div>


```ruby
class Forest::Payment
  include ForestLiana::Collection

  collection :payments

  field :id, type: 'String'
  field :amount, type: 'String'
  field :currency, type: 'String'
end
```

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb (**before** mounting the Forest Rails engine)</p>
  </div>
</div>

```ruby
namespace :forest do
  resources :payments
end
```

## Getting all records

Forest triggers the API call `GET /forest/:collection_name` to retrieve
the list of your records.

In the following example, `@payments` is an array of `Forest::Payment` class.
Let's say:

```
@payments = [
  Forest::Payment.new(
    id: 1,
    amount: 1000,
    currency: 'USD'
  ),
  Forest::Payment.new(
    id: 2,
    amount: 2000,
    currency: 'EUR'
  ),
  Forest::Payment.new(
    id: 3,
    amount: 3000,
    currency: 'USD'
  ),
]
```

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the index method</h2>
    <p class="l-step__description">app/controllers/forest/payments_controller.rb</p>
  </div>
</div>

```ruby
require 'jsonapi-serializers'

class Forest::PaymentsController < ForestLiana::ApplicationController
  def index
    # Check above to see what @payments is.
    render json: JSONAPI::Serializer.serialize(@payments, is_collection: true)
  end
end

```

## Getting a specific record

Forest triggers the API call `GET /forest/:collection_name/:id`
to retrieve a specific record.

In the following example, `@payment` is a instance of the `Forest::Payment`
class. Let's take the same data sample than above:

```ruby
@payments = [
  Forest::Payment.new(
    id: 1,
    amount: 1000,
    currency: 'USD'
  ),
  Forest::Payment.new(
    id: 2,
    amount: 2000,
    currency: 'EUR'
  ),
  Forest::Payment.new(
    id: 3,
    amount: 3000,
    currency: 'USD'
  ),
]
```

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the show method</h2>
    <p class="l-step__description">app/controllers/forest/payments_controller.rb</p>
  </div>
</div>

You can find the record ID to retrieve in the `params[:id]`.

```ruby
  def show
    payment = @payments.select { |p| p.id.to_s == params[:id] }.first

    render json: JSONAPI::Serializer.serialize(payment)
  end
```

## Handling BelongsTo relationships

A Smart Collection can have `belongsTo` relationships that point to other
collections. For example, let's say a `Payment` belongsTo an `Order`. Here's
how to configure the `belongsTo` relationship:

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the `belongsTo` relationship</h2>
    <p class="l-step__description">lib/forest_liana/collections/payments.rb</p>
  </div>
</div>

```ruby
class Forest::Payment
  include ForestLiana::Collection

  collection :payments

  # ...
  belongs_to :order, type: 'String', reference: 'orders.id'
end
```

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Link the data</h2>
    <p class="l-step__description">app/controllers/forest/payments_controller.rb</p>
  </div>
</div>

The last step is to simply retrieve each ActiveRecord `Order` correctly and add
it to the `payments` array. It should look like this:

```ruby
@payments = [
  Forest::Payment.new(
    id: 1,
    amount: 1000,
    currency: 'USD',
    order: Order.find(10041)
  ),
  Forest::Payment.new(
    id: 2,
    amount: 2000,
    currency: 'EUR',
    order: Order.find(10041)
  ),
  Forest::Payment.new(
    id: 3,
    amount: 3000,
    currency: 'USD',
    order: Order.find(10041)
  ),
]
```

## Handling HasMany relationships

A Smart Collection can have `hasMany` relationships that point to other
collections. For example, let's say a `Payment` hasMany `Menu`. Here's
how to configure the `hasMany` relationship:

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the `hasMany` relationship</h2>
    <p class="l-step__description">lib/forest_liana/collections/payments.rb</p>
  </div>
</div>

```ruby
class Forest::Payment
  include ForestLiana::Collection

  collection :payments

  # ...
  has_many :menus, type: 'String', reference: 'menus.id'
end
```

HasMany relationships are fetched asynchronuously when needed through an API
call. It means you have to catch the API call in a route and implement the
logic to fetch associated records dynamically.

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the hasMany route</h2>
    <p class="l-step__description">config/routes.rb (**before** mounting the Forest Rails engine)</p>
  </div>
</div>

```ruby
  namespace :forest do
    get '/payments/:payment_id/menus' => 'payments#menus'
    resources :payments
  end

  # ...
  # mount ForestLiana::Engine => '/forest'
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
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

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the hasMany method</h2>
    <p class="l-step__description">app/controllers/payments_controller.rb</p>
  </div>
</div>


```ruby
require 'jsonapi-serializers'

class Forest::PaymentsController < ForestLiana::ApplicationController

  def menus
    params[:filter] = { 'payment_id' => '2870' }
    params[:filterType] = 'and'

    getter = ForestLiana::ResourcesGetter.new(Menu, params)
    getter.perform

    render json: serialize_models(getter.records,
                                  include: getter.includes.map(&:to_s),
                                  count: getter.count)
  end
end
```
