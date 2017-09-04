# Segments

## Creating a Segment

A Segment is a subset of a collection gathering filtered records.

Forest provides a straightforward UI to configure step-by-step the segments you
want. The only information the UI needs to create a segment is a name and some
filters.

![Segment 1`](/public/img/segment-1.png)

## Creating a Smart Segment

Sometimes, segment filters are complicated and closely tied to your business.
Forest allows you to code how the segment is computed.

In the following example, we add the *VIP* segment to your Forest admin on
a collection *customers*.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the segment in the collection schema</h2>
    <p class="l-step__description">/forest/customers.js</p>
  </div>
</div>


```javascript
var Liana = require('forest-express-sequelize');

Liana.collection('customers', {
  segments: [{
    name: 'VIP',
    where: () => {
      // Compute and return a list of customer IDs.
    }
  }]
});
```

You're free to implement the business logic you need. The only requirement is
to return a list of your collection IDs (customer IDs in this example).

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">Your segment is now visible on Forest</p>
  </div>
</div>

![Segment 2`](/public/img/segment-2.png)

