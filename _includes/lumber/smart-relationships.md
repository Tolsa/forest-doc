# Smart Relationships

A field that displays a computed reference to another collection.

<img src="/public/img/smart-relationship-1.png" alt="Smart relationship" class="img--retina">

## What is a Smart Relationship?

A Smart Relationship is a [Smart Field](#smart-fields) that points to another
collection. Forest supports natively all the relationships defined in your
models (`belongsTo`, `hasMany`, …) (see <a
href="#adding-the-relationships">Adding the relationships</a>) but you can also
defined custom relationships between your data.

Try it out with one these 2 examples (it only takes a few minutes):

- [BelongsTo Smart Relationship](#example-belongsto-smart-relationship)
- [HasMany Smart Relationship](#example-hasmany-smart-relationship)

## Example: "belongsTo" Smart Relationship

In the following example, we add the last delivery man of a customer to your
Forest admin on a collection customers.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Relationship</h2>
    <p class="l-step__description">/forest/customer.js</p>
  </div>
</div>

```javascript
'use strict';
var Liana = require('forest-express-sequelize');
var models = require('../models');

Liana.collection('user', {
  fields: [{
    field: 'delivery_man',
    type: 'String',
    reference: 'deliveryMan.id',
    get: function (object) {
      // returns a Promise
      return models.deliveryMan
        .findOne({
          // where: { ... }
        });
    }
  }]
});

```
## Example: "hasMany" Smart Relationship

In the following example, we add the top 3 movies of an actor to your
Forest admin on a collection actors.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Field</h2>
    <p class="l-step__description">/forest/actor.js</p>
  </div>
</div>

```javascript
'use strict';
var Liana = require('forest-express-sequelize');

Liana.collection('actors', {
  fields: [{
    field: 'topmovies',
    type: ['String'],
    reference: 'movies.id'
  }]
});

```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Create the route in the routes/ directory</p>
  </div>
</div>

```javascript
var express = require('express');
var router = express.router();
var liana = require('forest-express-sequelize');
var Serializer = require('forest-express-serializer').ResourceSerializer;

function topMovies(req, res) {
  // your business logic to retrieve the top 3 movies
  .then((movies) => {
    return new liana.ResourceSerializer(liana, models.movies, movies, {}, {
      count: movies.length
    }).perform();
  })
  .then((projects) => res.send(projects))
  .catch(next);
}

router.get('/forest/actor/:actorId/relationships/movies', topMovies);

module.exports = router;
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

![SmartField 1](/public/img/smart-field-1.png "smart-field-1")

