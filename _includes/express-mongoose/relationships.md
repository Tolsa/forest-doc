# Relationships

## What is a relationship?

A relationship is a connection between two collections.

Forest supports natively all the relationships defined in your Mongoose models
(`ref` option, embed documents, …). <a
href="http://mongoosejs.com/docs/guide.html"
target="_blank">Check the Mongoose documentation</a> to create new ones.

<img src="/public/img/relationship-1.png" alt="relationship">

## What is a Smart Relationship?

Sometimes, you want to create a relationship between two set of data that does
not exist in your database. A concrete example could be creating a relationship
between two collections available in two different databases. Creating a Smart
Relationship allows you to customize with code how your collections are linked
together.

## Handling BelongsTo relationships

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
var Liana = require('forest-express-mongoose');
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

## Handling HasMany relationships

Let's say a `User` hasMany `Account`. Here's how to configure the `hasMany`
Smart Relationships.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart Relationship</h2>
    <p class="l-step__description">/forest/user.js</p>
  </div>
</div>

```javascript
'use strict';
var Liana = require('forest-express-mongoose');

Liana.collection('users', {
  fields: [{
    field: 'accounts',
    type: ['String'],
    reference: 'accounts.id'
  }]
});

```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">app.js</p>
  </div>
</div>

```ruby
app.use('/forest', require('./routes/user'));
```
<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the route</h2>
    <p class="l-step__description">/routes/user.js</p>
  </div>
</div>

```javascript
'use strict';
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const Account = require('../models/account');

function userAccounts(req, res) {
  let condition = { userId: req.params.userId };
  let limit = parseInt(req.query.page.size);
  let skip = (parseInt(req.query.page.number) - 1) * limit;

  return Account.find(condition).limit(limit).skip(skip).exec()
    .then((accounts) => {
      return Account.count(condition)
        .then((count) => {
          return new Liana.ResourceSerializer(Liana, Account, accounts, null, {}, {
            count: count
          }).perform();
        });
    })
    .then((accounts) => {
      res.send(accounts);
    });
}

router.get('/users/:userId/relationships/accounts', userAccounts);

module.exports = router;
```
<div class="c-notice warning l-mt">
  ⚠️ Make sure to serialize the response properly using the liana.ResourceSerializer to allow Forest to display your data.
</div>

![SmartField 1](/public/img/smart-field-1.png "smart-field-1")
