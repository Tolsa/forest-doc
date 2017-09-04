# Getting Started

## Introduction

Forest instantly provides all common admin tasks such as CRUD operations, simple
chart rendering, user group management, and WYSIWYG interface editor.
That's what makes Forest a quick and easy solution to get your admin interface started.

This guide assists developers in having the admin completely tailored to cater
to their specific needs. We've developed Forest so that your admin is 100%
customizable. It means that you have full control over your data, your back-end
business logic and the UI.

Forest provides a **very simple** API-based framework to handle all parts of
your admin back-end configuration. You should be good to go in no time,
with virtually no learning curve.

## How it works

Before you start writing a single line of code, it's a good idea to get an overview of how Forest works.

<div class="l-step">
    <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
    <div class="u-o-h">
      <h2 class="l-step__title">The Initialization phase</h2>
      <p class="l-step__description">Install the Forest Liana on your application</p>
    </div>
</div>

<img src="/public/img/initialization_phase.png" alt="Initialization" class="img--retina">

There are three steps on the initialization phase:

- The <a href="#glossary">Forest Liana</a> analyses your data model and generates the <a href="#glossary">Forest UI Schema</a>.
- The <a href="#glossary">Forest Liana</a> pushes that schema to the Forest’s server with the <a href="#glossary">FOREST_ENV_SECRET</a>.
- The <a href="#glossary">Forest Liana</a> generates the <a href="#glossary">Admin API</a> on your application.

<div class="l-step">
    <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
    <div class="u-o-h">
      <h2 class="l-step__title">Forest's architecture</h2>
      <p class="l-step__description">Where the magic happens</p>
    </div>
</div>

<img src="/public/img/architecture.png" alt="archi" class="img--retina">

The magic of Forest lies in its architecture. Forest is divided into two main components:

- The <a href="#glossary">Forest Liana</a> that allows Forest to communicate seamlessly with your application’s database.
- The <a href="#glossary">Forest UI</a> (web application), accessible from any browser, that handles communication between the user and the database through your <a href="#glossary">admin API</a>.


## Data Privacy

The main advantage of Forest's architecture is that absolutely no data transits over our servers. The user accesses application data directly from the client and Forest is just deployed as a service to display and interact with the data. Read more about <a href="http://doc.forestadmin.com/knowledge-base/#hosting">hosting</a>.

With Forest, your data are transferred directly from your application to your browser while remaining invisible to our servers. See <a href="#how-it-works">how it works</a>.

![Privacy](/public/img/data_privacy.png "privacy")

## Security

We use a <a href="http://doc.forestadmin.com/knowledge-base/#accessibility">two-step authentication</a> to connect you to both Forest’s server and your <a href="#glossary">Admin API</a>.

<div class="l-step l-dmt">
    <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
    <div class="u-o-h">
      <h2 class="l-step__title">Log into your Forest account</h2>
      <p class="l-step__description">To retrieve your UI configuration</p>
    </div>
</div>

When logging into your account, your credentials are sent to the Forest’s server which returns the <a href="#glossary">UI token</a> to authenticate your session.

<div class="l-step">
    <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
    <div class="u-o-h">
      <h2 class="l-step__title">Log into your admin API</h2>
      <p class="l-step__description">To manage your data</p>
    </div>
</div>

Your password is sent to your <a href="#glossary">Admin API</a> which returns the <a href="#glossary">data token</a> signed by the <a href="#glossary">FOREST_AUTH_SECRET</a> you chose. Each of your requests to your Admin API are authenticated with the <a href="#glossary">data token</a>.

<img src="/public/img/data_security.png" alt="security" class="img--retina">

Your admin uses the <a href="#glossary">UI token</a> to make request about the UI configuration. And the <a href="#glossary">data token</a> is used to make queries on your <a href="#glossary">admin API</a> to manage your data. All our tokens are generated using the <a href="https://jwt.io/">JWT standard</a>.

## Installation

If you haven't yet, you should have Forest installed on your application.
The relevant information is below. You should be set in a few minutes, no more.
If you encounter any issue, feel free to drop us a line at
<a href="mailto:support@forestadmin.com">support@forestadmin.com</a> or using the live chat
available on our <a href="http://www.forestadmin.com">homepage</a>.

```javascript
// Install the Lumber CLI
npm install -g lumber-cli

// Generate your admin
lumber generate
```

## Adding the relationships

As Lumber generates an admin microservice from the database schema, it only
creates belongsTo relationships, based on all your foreign keys. Please note
that some ORMs do not create foreign key constraints. This means that in some
cases, you will have to add belongsTo relationships manually. Lastly, as
databases don't have the notion of inverse relationships, you will need to add
hasMany or hasOne relationships manually.

The generated admin microservice uses the ORM Sequelize. <a
href="http://docs.sequelizejs.com/" target="_blank">Check out their
documentation</a> for advanced model customization.

### Example: "book" belongsTo "user"

Open the file `models/book.js` and declare the belongsTo relationship in the
`associate()` function.

```javascript
'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  let Model = sequelize.define('book', {
    // ...
  }, {
    classMethods: {
      associate: () => {
        Model.belongsTo(models.user, { foreignKey: 'user_id' });
      }
    },
    // ...
  });

  return Model;
};
```

### Example: "user" hasMany "books"

Open the file `models/user.js` and declare the hasMany relationship in the
`associate()` function.

```javascript
'use strict';

module.exports = (sequelize, DataTypes) => {
  let models = sequelize.models;

  let Model = sequelize.define('user', {
    // ...
  }, {
    classMethods: {
      associate: () => {
        Model.hasMany(models.book, { foreignKey: 'user_id' });
      }
    },
    // ...
  });

  return Model;
};
```

## Glossary

- **Admin API** is generated by the Forest Liana to manage all your application data and business operations.
- **Collection** is a group of records gathered from a unique table of your database.
- **Data token** is used to authenticate your requests on your admin API.
- **Forest liana** is a locally-installed add-on that allows us to communicate seamlessly with your application’s database.
- **Forest UI** is the web application of Forest, accessible from any browser at <a href="#smart-charts">https://app.forestadmin.com</a>.
- **Forest UI Schema** is a schema of your data model generated by the Forest Liana.
- **FOREST_AUTH_SECRET** - chosen by yourself - is an environment variable used to sign the data token.
- **FOREST_ENV_SECRET** is an environment variable used to identify your project environment in Forest.
- **Segment** is a subset of a collection gathering filtered records.
- **Smart Action** is a specific action related to your business. Read more about <a href="#smart-action">action</a>.
- **Smart Chart** is a complex <a href="#simple-charts">chart</a> computed based on your business logic. Read more about <a href="#smart-charts">smart chart</a>.
- **Smart Collection** is a group of records gathered from different sources implemented following on your business logic. Read more about <a href="#smart-collections">smart collection</a>.
- **Smart Field** A field that displays a computed value in your collection. Read more about <a href="#smart-fields">smart field</a>.
- **Smart Relationship** A field that displays a link to another collection. Read more about <a href="#smart-relationships">smart relationship</a>.
- **Smart View** is a custom view - specific to one collection - that displays data in any way you want. <a href="#smart-views">Read more about smart views</a>.

