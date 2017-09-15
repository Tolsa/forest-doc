# Segments

## What is a segment?

A Segment is a subset of a collection gathering filtered records.

Segments are made for those who are willing to systematically visualize data
according to specific sets of filters. It allows you to save your filters
configuration so that you don't have to compute the same actions every day
(e.g. signup this week, pending transactions).

## Creating a Segment

Forest provides a straightforward UI to configure step-by-step the segments you
want. The only information the UI needs to create a segment within a collection
is a name and some filters.

![Segment 1`](/public/img/segment-1.png)

## Creating a Smart Segment

Sometimes, segment are complicated and closely tied to your business. The smart
segment allows you to describe the business logic behind your segment with
code.

Example:
Let's say you're working for an e-commerce website and you're willing to see
your list of VIP clients within a segmented view. A client is considered as
"VIP" once he's hit the threshold of 5 purchases onto your website. As you can
see, data is coming from 2 different sources: 1) from the customers' collection
2) from the orders' collections. You will then be able to compute the
aforementionned business logic and as described in the piece of code below:

In the following example, we add the VIP segment to your Forest admin on a
collection customers.

<div class="l-step l-pt l-mb">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the segment in the collection schema</h2>
    <p class="l-step__description">lib/forest_liana/collections/customer.rb</p>
  </div>
</div>

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :customers
  segment 'VIP' do
    { id: Customer
      .joins(:orders)
      .group('customers.id')
      .having('count(orders.id) > 5')
      .map(&:id) }
  end
end
```


There's virtually no limitations to Smart Segments. The only requirement is to
return a list of your collection IDs (customer IDs in this example).

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">Your segment is now visible on Forest</p>
  </div>
</div>

![Segment 2`](/public/img/segment-2.png)
