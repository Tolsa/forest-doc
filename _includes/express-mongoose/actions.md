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

Try it out with this example (it only takes 3 minutes):
- [Banning a user](#example-banning-a-user)


## Example: Banning a user

In the following example, we add the *Ban user* action to your Forest admin on
a collection *customers*.

<div class="l-step">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the action in the collection schema</h2>
    <p class="l-step__description">/forest/customers.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-mongoose');

Liana.collection('customers', {
  actions: [{ name: 'Ban user' }]
});
```
<br/>

⚠ Notice, that Forest requires automatically the files inside the `/forest`
directory. It's nor necessary nor advised to require theses files manually
in your code.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">Your action is now visible on Forest</p>
  </div>
</div>

![Action 1](/public/img/action-1.png "img1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Declare the route to the Express Router</p>
  </div>
</div>

```javascript
var liana = require('forest-express-mongoose');

function banUser(req, res) {
  // Your business logic to ban a user here.
  res.status(204).send();
}

// liana.ensureAuthenticated middleware takes care of the authentication for you.
router.post('/forest/actions/ban-user', liana.ensureAuthenticated, banUser);
```

## Handling input values

You can declare the list of fields when your action requires parameters from
the Human in front of the screen. Available options for each `field` are:

- Add a `description` that will help humans understand what value is expected.

- Determine whether a field is to be `required` or not.

- Set a `default value`.

- Add a `widget` to provide a simple and easy-to-use way of entering value for
  your end-users. Five widgets are currently supported: `JSON editor`, `rich
  text editor`, `date picker`, `text area`, `text input`.

<div class="l-step l-dmt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the form fields to your action</h2>
    <p class="l-step__description">/forest/customers.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-mongoose');

Liana.collection('reviews', {
  actions: [{
    name: 'Approve',
    fields: [{
      field: 'Comment',
      type: 'String',
      description: 'Personal description',
      isRequired: true,
      defaultValue: 'I approve this comment',
      widget: 'text area'
    }]
  }]
});
```

<br/>

Six types of field are currently supported: `Boolean`, `Date`, `Number`,
`String`, `File` and `Enum`. If you choose the `Enum` type, you can pass the
list of possible values through the `enums` key:

```javascript
{ field: 'Country', type: 'Enum', enums: ['USA', 'CA', 'NZ'] }
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The action form will appear when triggering the approve action.</p>
  </div>
</div>

![Action 2](/public/img/action-5.png)


## HTTP request payload

Selected records ids are passed to the HTTP request when triggering the action
button. The fields/values will be passed to the `values` attributes.

```json
{
  "data": {
    "attributes": {
      "ids": ["4285","1343"],
      "collection_name": "reviews",
      "values": {
        "Comment":"I approve this comment"
      }
    }
  },
  "type":"reviews"
}
```

## Customizing response

You can respond to the HTTP request with a simple status message to notify the
user whether the action was successfully executed or respond in a more
personalized and visible way with an html page.

To display a custom **error message**, you have to respond with a 400 Bad Request
status code and a simple payload like this: `{ error: 'The error message.' }`.

To display custom **success message**, you have to respond with a 200 OK
status code and a simple payload like this: `{ success: 'The success message.' }`.

You can also display a custom html page as a response using `{ html:
'<h1>Congratulations!</h1><p>The comment has been successfully approved</p> ...
... ...'}`.

![Action 2](/public/img/action-6.png)

## Downloading a file

The response of an action will be considered as a file to download if you pass
the option 'download' to the action declaration. It's very useful if you need
actions like "Generate an invoice" or "Download PDF".

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the download option to your action</h2>
    <p class="l-step__description">/forest/customers.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-mongoose');

Liana.collection('customers', {
  actions: [{ name: 'Download file', download: true }]
});
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Send the file as a response</h2>
    <p class="l-step__description">In your Express route</p>
  </div>
</div>

```javascript
function generateInvoice(request, response) {
  var options = {
    root: __dirname + '/../public/docs',
    dotfiles: 'deny',
    headers: {
      'Access-Control-Expose-Headers': 'Content-Disposition',
      'Content-Disposition': 'attachment; filename="invoice-234.pdf"'
    }
  };

  var fileName = 'invoice-234.pdf';
  response.sendFile(fileName, options, (error) => {
    if (error) { next(error); }
  });
}
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">The action returns now a file as a response</p>
  </div>
</div>

## Triggering an action from the collection

Passing the option `global: true` makes your Smart Action visible directly from
your collection without having to select records before. For example, our
["Import data"](#importing-data) Smart Action example uses this option.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the download option to your action</h2>
    <p class="l-step__description">/forest/customers.js</p>
  </div>
</div>

```javascript
var Liana = require('forest-express-mongoose');

Liana.collection('customers', {
  actions: [{ name: 'Import data', global: true }]
});
```

![Action 4](/public/img/action-4.png)
