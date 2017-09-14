# Relationships

## What is a relationship?

A relationship is a <a href="#fields" target="_self">Field</a> that points to
an another collection.

Forest supports natively all the relationships defined in your ActiveRecord models
(`belongsTo`, `hasMany`, …). <a
href="http://guides.rubyonrails.org/association_basics.html"
target="_blank">Check the Rails documentation</a> to create new ones.

<img src="/public/img/relationship-1.png" alt="relationship">

## What is a Smart Relationship?

Sometimes, you want to create a relationship that does not exist in your
database. A concrete example could be creating a relationship between two
collections available in two different databases. Creating a Smart Relationship
allows you to customize with code how your collections are linked together.

Try it out with one these 2 examples (it only takes a few minutes):

- [BelongsTo Smart Relationship](#example-belongsto-smart-relationship)
- [HasMany Smart Relationship](#example-hasmany-smart-relationship)

## Example: "belongsTo" Smart Relationship

In the following example, we add the last delivery man of a customer to your
Forest admin on a collection customers.

<img src="/public/img/smart-relationship-1.png" alt="Smart relationship"
  class="img--retina">

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Relationship</h2>
    <p class="l-step__description">lib/forest_liana/collections/customer.rb</p>
  </div>
</div>

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :customers

  belongs_to :last_delivery_man, reference: 'delivery_men.id' do
    object.orders.last.delivery_man # returns a "DeliveryMan" Model.
  end
end
```

## Example: "hasMany" Smart Relationship

In the following example, we add the top 3 movies of an actor to your
Forest admin on a collection actors.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Relationship</h2>
    <p class="l-step__description">lib/forest_liana/collections/actor.rb</p>
  </div>
</div>

```ruby
class Forest::Actor
  include ForestLiana::Collection

  collection :actors

  has_many :top_movies, type: ['string'], reference: 'movies.id'
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb</p>
  </div>
</div>

```ruby
namespace :forest do
  get '/actors/:actor_id/relationships/top_movies' => 'actors#top_movies'
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/forest/actors_controller.rb</p>
  </div>
</div>

```ruby
class Forest::ActorsController < ForestLiana::ApplicationController
  def top_movies
    movies = Actor
      .find(params['actor_id'])
      .movies
      .order('imdb_rating DESC')
      .limit(3)

    render json: serialize_models(movies, include: [], count: movies.count)
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

![SmartField 1](/public/img/smart-field-1.png "smart-field-1")

