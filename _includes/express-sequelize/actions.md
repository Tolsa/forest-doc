# Actions

## What is an action?

An action is a button that triggers server-side logic through an API call.
Without a single line of code, Forest supports natively all common actions
required on an admin interface such as CRUD (Create, Read, Update, Delete),
sort, search, data export.

## What is a Smart Action?

Sooner or later, you will need to perform actions on your data that are
specific to your business. Moderating comments, logging into a customer’s
account (a.k.a impersonate) or banning a user are exactly the kind of important
tasks you need to make available in order to manage your day-to-day operations.

<img src="/public/img/action-3.png" alt="Action" class="img--retina">
![Action Button](/public/img/action-3.png "Action Button")

You can implement 3 types of Smart Actions with Forest:

- [Bulk Smart Action](#bulk-smart-action) -> Targets one or several records at a time.
> _example: You want to ban several Users in one shot._

- [Global Smart Action](#global-smart-action) -> Related to a collection but does not target any specific record(s).
> _example: You want to manually generate some Invoices based on recent activity of y from time to time._

- [Single Smart Action](#single-smart-action) -> Targets a single record.
> _example: You want to charge a User on one of the credit card available in his/her profile._

## Bulk Smart Action

### Explanation

This is the default type of action.<br>
If you don't specify the type in your Smart Action declaration, it will be a Bulk action.<br>

This action is accessible in:
- the records list (it become visible as soon as you select a record in the list).
- the record details.
- the related data of a record (it become visible as soon as you select a record in the list).

### Implementation

In the following example, we create the **Ban** action on a **Users** collection.<br>
By convention, Forest create a POST route based on the name of the Smart Action.<br>
In this case, the route will be `/forest/actions/ban`.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the Smart Action</h2>
    <p class="l-step__description">/forest/users.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-sequelize');

Liana.collection('users', {
  actions: [{
    name: 'Ban',
    type: 'bulk'
  }]
});
```

<div class="c-notice info l-mt">
  ⚠️  Notice, that Forest requires automatically the files inside the <code>/forest</code>
  directory. It's nor necessary nor advised to require theses files manually
  in your code.
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step">Implement the controller</h2>
  </div>
</div>

Declare the route to the Express Router and implement the business logic to ban user(s).

```javascript
var express = require('express');
var Liana = require('forest-express-sequelize');

var router = express.Router();

function ban(request, response) {
  var userIdsToBan = request.body.data.attributes.ids;

  // TODO: Adapt the code below to implement your own business logic.
  return models.user
    .update({ banned: true }, { where: { id: userIdsToBan } })
    .then(function () { return response.status(204).send(); })
    .catch(function (error) { return response.status(422).send(); });
}

router.post('/forest/actions/ban', Liana.ensureAuthenticated, ban);
```
<div class="c-notice info l-mt">
  <code>Liana.ensureAuthenticated</code> middleware takes care of the authentication for you.
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step">Restart your Express server</h2>
  </div>
</div>

In your Forest project, the action is now accessible in the **Users** collection list and in each **User** details view.
The action is now visible in the Forest interface.

![Bulk Action](/public/img/action-1.png "Bulk Action")

Let's test it!
- Select some records,
- Open the "Actions" menu,
- Click on the "Ban" action.

## Global Smart Action

### Explanation

This action is only accessible in the records list. You don't have to select records to let it appear.<br>
The action is automatically disabled as soon as you select at least one record in your collection list.

### Implementation

In the following example, we create the **Generate Missing Ones** action on a **Invoices** collection.<br>
By convention, Forest create a POST route based on the name of the Smart Action.<br>
In this case, the route will be `/forest/actions/generate-missing-ones`.


<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the Smart Action</h2>
    <p class="l-step__description">/forest/invoices.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-sequelize');

Liana.collection('invoices', {
  actions: [{
    name: 'Generate Missing Ones',
    type: 'global'
  }]
});
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step">Implement the controller</h2>
  </div>
</div>

Declare the route to the Express Router and implement the business logic to generate the missing invoices.

```javascript
var express = require('express');
var Liana = require('forest-express-sequelize');

var router = express.Router();

function generateMissingOnes(request, response) {
  // TODO: Adapt the code below to implement your own business logic.
  return models.invoices
    .findAll({ where: { incomplete: true } })
    .each(function (invoice) { return invoice.generate(); })
    .then(function () { return response.status(204).send(); })
    .catch(function (error) { return response.status(422).send(); });
}

router.post('/forest/actions/generate-missing-ones', Liana.ensureAuthenticated, generateMissingOnes);
```
<div class="c-notice info l-mt">
  <code>Liana.ensureAuthenticated</code> middleware takes care of the authentication for you.
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step">Restart your Express server</h2>
  </div>
</div>

In your Forest project, the action is now accessible in the **Invoices** collection list.

![Global Action](/public/img/action-1.png "Global Action")

Let's test it!
- Open the "Actions" menu,
- Click on the "Generate Missing Ones" action.

## Single Smart Action

### Explanation

This action is only accessible in a record details view  and, thus, cannot be executed on several records at the same time.

### Implementation

In the following example, we create the **Charge Credit Card** action on a **Users** collection.<br>
By convention, Forest create a POST route based on the name of the Smart Action.<br>
In this case, the route will be `/forest/actions/charge-credit-card`.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the Smart Action</h2>
    <p class="l-step__description">/forest/users.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-sequelize');

Liana.collection('users', {
  actions: [{
    name: 'Charge Credit Card',
    type: 'single'
  }]
});
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step">Implement the controller</h2>
  </div>
</div>

Declare the route to the Express Router and implement the business logic to charge the user credit card.

```javascript
var express = require('express');
var Liana = require('forest-express-sequelize');

var router = express.Router();

function chargeCreditCard(request, response) {
  var userId = request.body.data.attributes.ids[0];

  // TODO: Adapt the code below to implement your own business logic.
  return models.creditCard
    .findOne({ where: { userId: userId } })
    .then(function (creditCard) { return creditCard.charge(); })
    .then(function () { return response.status(204).send(); })
    .catch(function (error) { return response.status(422).send(); });
}

router.post('/forest/actions/charge-credit-card', Liana.ensureAuthenticated, chargeCreditCard);
```
<div class="c-notice info l-mt">
  <code>Liana.ensureAuthenticated</code> middleware takes care of the authentication for you.
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step">Restart your Express server</h2>
  </div>
</div>

In your Forest project, the action is now accessible in each **Users** details view.

![Single Action](/public/img/action-1.png "Single Action")

Let's test it!
- Select a **User** record,
- Open the "Actions" menu,
- Click on the "Charge Credit Card" action.

## Forms

### Introduction

In most cases, you'll need to let the Humans using Forest add contextual data to run your business logic.<br>
Here are a few examples:
- when you ban some user(s), you might want to specify the reason,
- when you generate missing invoice(s), you could need to filter which type you want to generate,
- when you charge a user's credit card, you will definitely need to choose the amount and currency,
- ...

Simple Smart Actions like described above won't be enough for theses use cases.<br>
Don't worry we have a simple solution for you.

### Implementation

In the following example, we will add some fields to improve the **Charge Credit Card** Smart Action we implemented above. The form will request an **amount**, a **currency** and a **reason** to charge the user.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the necessary form fields to your action</h2>
    <p class="l-step__description">/forest/users.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-sequelize');

Liana.collection('users', {
  actions: [{
    name: 'Charge Credit Card',
    type: 'single',
    fields: [{
      field: 'Amount',
      type: 'Number',
      required: true
    }, {
      field: 'Currency',
      type: 'Enum',
      enums: ['Dollars', 'Euros', 'Rupee', 'Yen', 'Yuan'],
      defaultValue: 'Dollars',
      required: true
    }, {
      field: 'Reason',
      description: 'Please enter here the detailed reason of charging',
      type: 'String',
      widget: 'text area'
    }]
  }]
});
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step">Handle the input values in the controller</h2>
  </div>
</div>

Declare the route to the Express Router and implement the business logic to charge the user credit card using the values that will submitted.

```javascript
var express = require('express');
var Liana = require('forest-express-sequelize');

var router = express.Router();

function chargeCreditCard(request, response) {
  var attributes = request.body.data.attributes
  var userId = attributes.ids[0];
  var values = attributes.values;

  // TODO: Adapt the code below to implement your own business logic.
  return models.creditCard
    .findOne({ where: { userId: userId } })
    .then(function (creditCard) {
      return creditCard.charge({
        amount: values.Amount
        currency: values.Currency,
        reason: values.Reason
      });
    })
    .then(function () { return response.status(204).send(); })
    .catch(function (error) { return response.status(422).send(); });
}

router.post('/forest/actions/charge-credit-card', Liana.ensureAuthenticated, chargeCreditCard);
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step">Restart your Express server</h2>
  </div>
</div>

In your Forest project, the action is now accessible in each **Users** details view. As soon as you click on the "Charge Credit Card" action, Forest will display a form to fill in.

![Form](/public/img/action-5.png "Form")

Let's test it!
- Select a **User** record,
- Open the "Actions" menu,
- Click on the "Charge Credit Card" action.
- Fill in the form,
- Click on the "Charge Credit Card"

## Controller Context

The more info you have access to in your controller, the more flexible you'll be to develop your business logic in the Smart Actions controllers.

### Triggered records and form values

The targeted record ids for the action are accessible in the controller, along with the form values.
To access it you can use `request.body.data.attribute`.

```javascript
function ban(request, response) {
  var context = request.body.data.attribute;
  var userIdsToBan = context.ids;
  var reason = context.values.Reason;
  // ...
}
```

```json
{
  "ids": ["4285","1343"],
  "collection_name": "user",
  "values": {
    "Reason": "This user cannot be charged for the third time this month."
  }
}
```

### Admin User

If you need to have some context about the Admin user that triggered the action in the controller, you can use `request.user` value.

```javascript
function chargeCreditCard(request, response) {
  var adminUserInfo = request.user;
  // ...
}

router.post('/forest/actions/charge-credit-card', Liana.ensureAuthenticated, chargeCreditCard);
```

## Custom Responses

### Success messages

You can customize the message displayed in the Forest interface one the action execution succeeded or failed.

To display a custom **success** message, you have to respond with a `200 [OK]` or `204 [No Content]` like in the example below:<br>
```javascript
return response.status(200)
  .send({
    success: 'The user has been successfully charged. He will be notified with an email in a few minutes.'
  });
```

![Success Toastr](/public/img/action-7.png "Success Toastr")

### Error messages

To display a custom **error** message you have to respond with a `400 [Bad Request]` status code and a payload looking like:<br>
`{ error: 'An error occurred while charging the user, the credit card is not provisioned.' }`.

```javascript
return response.status(400)
  .send({
    error: 'An error occurred while charging the user, the credit card is not provisioned.'
  });
```

![Error Toastr](/public/img/action-8.png "Error Toastr")


### Display more information

If you need to display a lot more information (and not only text), what you can do is to send some HTML as a response in the controller.
It will display a response panel once the action done.

Follow the example below to display such a response,
```javascript
return response.status(200)
  .send({
    html: '<h1>User\'s Credit Card Charge</h1><p>Credit card successfully charged</p><p>Amount: $ 98.00</p><p>Reason: The user asked for a premium delivery .</p>'
  });
```

![Display more information](/public/img/action-6.png "Display more information")

## Dev Cheatsheet

### Actions

| Name       | Type                               | Presence  | Description
|------------|-------------------------------------------------------------
| name       | string                             | mandatory | Name of the action displayed in Forest.
| type       | `'bulk'` / `'global'` / `'single'` | optional  | Type of the action. The default value is `'bulk'`.
| fields     | array of fields                    | optional  | Necessary if you want a form.
| download   | boolean                            | optional  | Enable the action to trigger a file download. Default value: `false`
| endpoint   | string                             | optional  | Enables to override the default route generated by Forest for the Smart Action controller.
| httpMethod | strings                            | optional  | Enables to override the default method (`POST`) generated by Forest for the Smart Action controller.

### Form fields

| Name         | Type                                                                            | Presence  | Description
|--------------|---------------------------------------------------------------------------------|-----------|-------------
| field        | string                                                                          | mandatory | Name of the field in the form.
| type         | `'Boolean'` / `'Number'` / `'String'` / `'Enum'` / `'Date'` / `'File'`          | mandatory | Type of the input in the form.
| description  | string                                                                          | optional  | Enables to explain what is this field for in the form.
| enums        | array of strings                                                                | optional  | If your field type is `'Enum'`, enables you to specify the possible options for the input. <br>ex: `enums: ['Dollars', 'Euros', 'Rupee', 'Yen', 'Yuan']`
| reference    | string                                                                          | optional  | Enables to reference a record from another collection. (Use a field type `'Number'` or `'String'`) <br>ex: 'creditCard.id'
| required     | boolean                                                                         | optional  | If true, the action form cannot be submitted with an empty value in this field.
| defaultValue | any valid value for the field type you choose                                   | optional  | Pre-fill the field with this value. ex: `defaultValue: 'Dollars'`
| widget       | `JSON editor` / `rich text editor` / `date picker` / `text area` / `text input` | optional  | Decorates the input with a specific widget.
