# Smart Fields

A field that displays a computed value in your collection.

<img src="/public/img/smart-field-2.png" alt="Smart field" class="img--retina">

## What is a Smart Field?

A Smart Field is a column that displays processed-on-the-fly data. It can be as
simple as "massaging" attributes to make them human friendly, or more complex
and use relationships to display things such as a total of orders for one of
your customers or a number of users for a product.


Try it out with 1 these 2 examples (it only takes **3 minutes**):

- [Concatenate First and Last names](#example-concatenate-first-and-last-names)
- [Number of orders for a customer](#example-number-of-orders-for-a-customer)

## Example: Concatenate First and Last names

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Field</h2>
    <p class="l-step__description">/forest/user.js</p>
  </div>
</div>

```javascript
'use strict';
var Liana = require('forest-express-sequelize');

Liana.collection('user', {
  fields: [{
    field: 'fullname',
    type: 'String',
    get: function (object) {
      return object.firstName + ' ' + object.lastName;
    }
  }]
});

```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

## Example: Number of orders for a customer

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Field</h2>
    <p class="l-step__description">/forest/user.js</p>
  </div>
</div>

```javascript
'use strict';
var Liana = require('forest-express-sequelize');
var models = require('../models');

Liana.collection('user', {
  fields: [{
    field: 'numberOfOrders',
    type: 'Number',
    get: function (object) {
      // returns a Promise
      return models.environment.count({
        where: { projectId: project.id }
      });
    }
  }]
});

```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The Smart Field will appear in your collection.</p>
  </div>
</div>

## Updating a Smart Field

In order to update a Smart Field, you just need to write the logic to "unzip"
the data. Note that the `set` method should always return the object it's
working on. In the example hereunder, the `user` is returned.

If you need an Async process, you can also return a Promise that will return
the user at the end.

```javascript
'use strict';
const Liana = require('forest-express-sequelize');

Liana.collection('user', {
  fields: [{
    field: 'fullName',
    type: 'String',
    get: function (user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      } else {
        return null;
      }
    },
    set: function (user, value) {
      var names = value.split(' ');
      user.firstName = names[0];
      user.lastName = names[1];

      return user;
    }
  }]
});
```

## Searching on a Smart Field

To perform search on a Smart Field, you also need to write the logic to "unzip"
the data, then the search query which is specific to your zipping. In the
example hereunder, the `firstname` and `lastname` are searched separately after
having been unzipped.


If you are working with Async, you can also return a Promise.

```javascript
'use strict';
const Liana = require('forest-express-sequelize');

Liana.collection('user', {
  fields: [{
    field: 'fullName',
    type: 'String',
    get: function (user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      } else {
        return null;
      }
    },
    search: function (query, search) {
      let s = models.sequelize;
      let split = search.split(' ');

      var searchCondition = s.and(
        { firstName: { $ilike: split[0] }},
        { lastName: { $ilike: split[1] }}
      );

      let searchConditions = _.find(query.where.$and, '$or');
      searchConditions.$or.push(searchCondition);
    }
  }]
});
```
