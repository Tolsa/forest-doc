# Relationships

## What is a relationship?

A relationship is a connection between two collections.

Forest supports natively all the relationships defined in your Mongoose models
(`ref` option, embed documents, …). <a
href="http://mongoosejs.com/docs/guide.html"
target="_blank">Check the Mongoose documentation</a> to create new ones.

## What is a Smart Relationship?

Sometimes, you want to create a relationship between two set of data that does
not exist in your database. A concrete example could be creating a relationship
between two collections available in two different databases. Creating a Smart
Relationship allows you to customize with code how your collections are linked
together.

Try it out with one these 2 examples (it only takes a few minutes):

- [BelongsTo Smart Relationship](#example-quot-belongsto-quot-smart-relationship)
- [HasMany Smart Relationship](#example-quot-hasmany-quot-smart-relationship)

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
var DeliveryMan = require('../models/delivery-man');

Liana.collection('users', {
  fields: [{
    field: 'delivery_man',
    type: 'String',
    reference: 'deliveryMan.id',
    get: function (object) {
      // returns a Promise
      return DeliveryMan
        .findOne({
          // ...
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
var Liana = require('forest-express-mongoose');

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
    <p class="l-step__description">Declare the route to the Express Router</p>
  </div>
</div>

```javascript
var liana = require('forest-express-mongoose');

function topMovies(req, res) {
  // your business logic to retrieve the top 3 movies
  .then((movies) => {
    return new liana.Serializer(liana, models.movies, movies, null, {}, {
      count: movies.length
    }).perform();
  })
  .then((projects) => res.send(projects))
  .catch(next);
}

router.get('/forest/actor/:actorId/relationships/movies', topMovies);
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

![SmartField 1](/public/img/smart-field-1.png "smart-field-1")

