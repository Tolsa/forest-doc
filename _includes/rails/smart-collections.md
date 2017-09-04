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

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Collection</h2>
    <p class="l-step__description">lib/forest_liana/collections/brand.rb</p>
  </div>
</div>


```ruby
class Forest::Brand
  include ForestLiana::Collection

  collection :brands
  field :brand, type: 'String'
  field :count, type: 'Number'
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
  resources :brands
end
```

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the API</h2>
    <p class="l-step__description">app/controllers/forest/brands_controller.rb</p>
  </div>
</div>

```ruby
# ForestLiana::ApplicationController takes care of the authentication for you.
class Forest::BrandsController < ForestLiana::ApplicationController
  def index
    brands = Item.all
      .group(:brand)
      .order(:brand)
      .count
      .map.with_index do |f, index|
        {
          id: index,
          type: 'brands',
          attributes: {
            brand: f.first,
            count: f.second
          }
        }
      end

    render json: { data: brands }
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">The Smart Collection will appear in the navigation bar.</p>
  </div>
</div>
