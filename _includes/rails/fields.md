# Fields

## What is a field?

A field is simply an attribute defined in your database. Examples of fields:
`first name`, `gender`, `status`, etc.

## Customizing a field

Forest allows you to customize how a field appears in your admin interface. You
can rename it, choosing the right widget to display (e.g. `text area`, `image
viewer`, `Google map`), adding a description or even setting the read/write
access.

![Field 1`](/public/img/field-1.png)

To customize a field, go to Collection Settings -> Fields. Then select the
field to start configuring it.

## What is a Smart Field?

A field that displays a computed value in your collection.

<img src="/public/img/smart-field-2.png" alt="Smart field" class="img--retina">

A Smart Field is a column that displays processed-on-the-fly data. It can be as
simple as concatenating attributes to make them human friendly, or more complex
(e.g. total of orders).

## Creating a Smart Field

Try it out with 1 of these 2 examples (it only takes **3 minutes**):

- [Concatenate First and Last names](#example-concatenate-first-and-last-names)
- [Number of orders for a customer](#example-number-of-orders-for-a-customer)

### Example: Concatenate First and Last names

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Field</h2>
    <p class="l-step__description">lib/forest_liana/collections/user.rb</p>
  </div>
</div>

```ruby
class Forest::User
  include ForestLiana::Collection

  collection :User

  field :fullname, type: 'String' do
    "#{object.firstname} #{object.lastname}"
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

### Example: Number of orders for a customer

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Field</h2>
    <p class="l-step__description">lib/forest_liana/collections/customer.rb</p>
  </div>
</div>

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  field :number_of_orders, type: 'Number' do
    object.orders.length
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

## Updating a Smart Field

In order to update a Smart Field, you just need to write the logic to "unzip"
the data. Note that the `set` method should always return the object it's
working on. In the example hereunder, the `user` is returned.

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  set_fullname = lambda do |user_updated_params, fullname_value|
    user_updated_params = fullname_value.split
    user_updated_params[:firstname] = fullname_value.first
    user_updated_params[:lastname] = fullname_value.last

    # NOTICE: Returns a hash of the updated values you want to persist
    user_updated_params
  end

  field :fullname, type: 'String', set: set_fullname do
    "#{object.firstname} #{object.lastname}"
  end
end
```

## Searching on a Smart Field

To perform search on a Smart Field, you also need to write the logic to "unzip"
the data, then the search query which is specific to your zipping. In the
example hereunder, the `firstname` and `lastname` are searched separately after
having been unzipped.


```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer

  search_fullname = lambda do |query, search|
    firstname, lastname = search.split
    query.where_clause.send(:predicates)[0] << " OR (firstname = '#{firstname}' AND lastname = '#{lastname}')"

    query
  end

  field :fullname, type: 'String', search: search_fullname do
    "#{object.firstname} #{object.lastname}"
  end
end
```
