---
title: Knowledge Base
layout: knowledge-base
---

# General

## Basics

### What is Forest?
<span class="l-category l-category__forest">Forest-only</span>

Forest is a universal admin interface designed to manage all your application data and business operations. Forest helps developers to focus on their product instead of wasting time building and maintaining an outdated DIY admin.

### How does Forest work?
<span class="l-category l-category__forest">Forest-only</span>

Forest is comprised of an agent (Liana) and a front-end application (UI). Once you install the agent on your app, it will scan your ORM, retrieve the models, and generate an admin REST API that will communicate with the admin UI. Then, when the user logs on to our web app (<http://app.forestadmin.com>), it queries both the Forest's server (to get the UI configuration) and your application (to retrieve the data).

### What is Lumber?
<span class="l-category l-category__lumber">Lumber-only</span>

Lumber is a CLI that generates an admin interface out of an existing MySQL or
Postgres database. You can then start using and customizing your new admin
microservice in no time.

### How does Lumber work?
<span class="l-category l-category__lumber">Lumber-only</span>

Lumber generates the admin REST api automatically based on your database schema.
We only host the UI (<http://app.forestadmin.com>). It is up to you to decide on where the admin miscroservice is hosted. It means that your data will
**never** reach our servers. You can test your admin on your local environment with a
local database and then deploy it to your production environment.

### Is it open source?
<span class="l-category">All products</span>

Everything related to your data or business logic is open source, available
freely on our [GitHub account](https://github.com/ForestAdmin).

We host the admin UI. No data from your application ever reaches our servers as requests are
initiated directly from your browser, to your application.

### Does it rely on a DSL?
<span class="l-category">All products</span>

Forest is based on a standard REST API. You don't need to learn any DSL to
customize the backend. Moreover, you are free to extend the API for all your
particular needs.

### How does it access the data from my collections?
<span class="l-category l-category__forest">Forest-only</span>

The Liana (gem in Rails, package in Node, etc.) you install on your app will
analyze the structure of your models and generate a dedicated admin REST API that
handles all your common tasks such as CRUD actions, search &amp; filters,
sorting, pagination, charts, etc.

### Can I simply point Forest at a database rather than plug it into my app?
<span class="l-category">All products</span>

Yes. This is exactly what Lumber does: <http://www.forestadmin.com/lumber>.
Lumber generates an ExpressJS admin microservice, isolated from your app.

## Forest vs Lumber

### What's the difference between Forest and Lumber?
<span class="l-category">All products</span>

Lumber is a generator that creates an admin microservice after scanning the structure of your database. Forest is an agent that you install directly on your app,
where it analyzes the structure of your models. In the end, both generate a REST API
that allows you to operate on your data via Forest's UI.

## Hosting

### Do you offer a self-hosted, on-premise version of Forest?
<span class="l-category">All products</span>

No, but you can always
[contact our Enterprise team](mailto:sales@forestadmin.com).

Forest is installed directly within your application (or in the microservice
with Lumber). It generates an admin REST API automatically, so that your app can
communicate with the UI, that is hosted on our side (http://app.forestadmin.com).
It's the only part of the product that's on our servers.

We chose this architecture for two main reasons:

* your data *never* reaches our servers.
* we can continue to develop great features and implement them in the UI.

Note we can also help you setup a custom DNS to get a legible URL for your end
users.

## Pricing

### How does the pricing work?
<span class="l-category">All products</span>

Forest is **completely free**, see our [blog post](https://medium.com/@vincentghyssens/a5c93e7a9cb4#.mpng5dnl1). That applies to projects and teams of all sizes.
Our Enterprise plan is for bigger companies with particular needs
(SLA, dedicated support, etc.): <http://www.forestadmin.com/enterprise>


# Product

## Supported technologies

### Does Lumber works with MongoDB?
<span class="l-category l-category__lumber">Lumber-only</span>

Not yet. Lumber needs to scan the DB structure to generate the admin
microservice. With MongoDB, all the informations about data structure are in the
ORM schemas, which makes the scanning process more difficult. So far Lumber supports MySQL and
Postgres DBs. The standard version of Forest supports Express/Mongoose.

### Do you have other frameworks support?
<span class="l-category">Forest</span>

We've developed [Lumber](http://forestadmin.com/lumber),
an admin microservice generator that creates for you an admin microservice
built to run Forest. For the moment, it's compatible with any MySQL &amp; Postgres
databases. [Check it out!](http://forestadmin.com/lumber)

## Data Privacy & Security

### How secure is Forest?
<span class="l-category l-category__forest">Forest-only</span>

Forest's architecture is designed to make it impossible for us to access your
data. Forest env secret is used to identify the project on Forest. The auth secret
is used to secure requests to the admin API using JWT (<https://jwt.io>).

By default, all requests to your application data are secured (using SSL if
available) and authenticated with a token that only you can generate.

### What kind of information do you collect?
<span class="l-category">All products</span>

The architecture of Forest is designed to make it impossible for us to access
your actual data. Forest Lianas (our framework-specific agents) need to scan the
schemas in order to generate the UI views.

Here is the complete list of information we collect or store in our database:
* user info (email, encrypted Forest password, name)
* project info (name, environments and API endpoints, mapping of the schema/models)
* your Forest configuration (one configuration being specific to a team/project pair)
* activity info (an auditable trail of every action performed within Forest)

### How to setup HTTPS on Forest?
<span class="l-category">All products</span>

Forest is adapting to your application protocol following the url provided in your environments settings. To setup HTTPS on Forest, simply provide a https application url in your environments settings.

## Migrate to Forest

### I have a lot of custom business logic that basic scaffolding won't be able to handle…
<span class="l-category">All products</span>

We wrote a [blog post](https://medium.com/into-the-forest/myth-1-my-app-is-too-specific-i-need-a-home-made-admin-36562949b65d) about this concern. We designed Forest from day one to handle all specific use cases, operations, and
business logic. If you already have implemented custom logic to fit your own
needs, it'll only take a few lines of code to expose them to Forest and have
them readily available in your admin.

## Environments

### Is it possible to have a separate Forest interface for both dev and prod environments?
<span class="l-category">All products</span>

Yes. UI configurations are specific to environments. By default, you run Forest
in the dev environment. You can create a new environment in the project settings.

### Should we share the development environment or should each dev create their own?
<span class="l-category">All products</span>

We recommend that each developer should have its own development environment.

### When something is configured in one environment, how do you propagate the setup (i.e. dev -> staging -> prod)?
<span class="l-category">All products</span>

To deploy a change from environment to another, you can use the "Copy layout configuration" feature in your project settings -> Environments. We recommend first to deploy from dev to staging, and then from staging to production.

## Maintenance

### Is it maintained?
<span class="l-category l-category__forest">Forest-only</span>

Yes, Forest is funded and actively maintained. It is used by many teams,
including all the projects from the startup studio [eFounders](efounders.co).
We host the front-end app on <http://app.forestadmin.com>, so you don’t have to
maintain it. We continuously improve upon it. We provide open source packages to
install Forest and generate the admin API automatically. They're all available
on our Github account: <https://github.com/ForestAdmin>

## Performance

### What is Forest bandwidth consumption? Is it hosted by Forest or the client?
<span class="l-category l-category__forest">Forest-only</span>

Forest is hosted on your side. We do our best to reduce the number of queries and are constantly working on the
optimization of those (both HTTP and database queries). This way, Forest
should use less resources than home-made admins, and thus be more performant
overall than any other custom-built solution. You can always isolate Forest in a
completely separated part of your app in order to control the scope of your app
and your admin independently.

## Activity Log

### Is it possible to use Forest to track users' actions?
<span class="l-category l-category__forest">Forest-only</span>

As long as you have data in your database, it is possible to act on them via
Forest or display them in a dashboard. If you're looking for tools specifically
to track users' behavior in your application, Forest will not be fitting.
We recommend using tools such as [Segment](segment.com),
[Mixpanel](mixpanel.com) or [Heap](https://heapanalytics.com).
That being said, we're working on integrations to bring those data back in your
Forest.

## Users, roles and permissions

### What are the different users roles and rights in Forest?
<span class="l-category">All products</span>

User roles determine the access level or permissions of your teammates. Forest Admin allows you to setup three different kinds of users or 'Roles'.

* **Admin** - can access project settings (manage teams, users roles and environments), customize the admin UI (activate layout editor) and manage data.
* **Editor** - can customize the admin UI (activate layout editor) and manage data.
* **User** - can manage data only.

### Where can I manage users roles?
<span class="l-category">All products</span>

You can define users roles in your project settings. Go to *Settings* -> *Users* and assign roles to each of your teammates.

<img src="../img/users-roles.png" alt="roles" class="img--retina">


# Technical

## Installation

### How do I install it?
<span class="l-category">All products</span>

Head over to <http://www.forestadmin.com> where you can start the installation
process by entering your email and then **Get started**.

## Accessibility

### Why is there two login pages?
<span class="l-category">All products</span>

The first one (with email + password) logs you in your Forest account. The second
one (password only) authenticates you to your own application, to access your
data. This process is necessary to keep the promise that Forest never have
access to your data, as the second login generates the token with which every
single one of our requests is authenticated.

## CORS issue

### I can't unlock my account, I'm seeing a CORS error
<span class="l-category l-category__forest">Forest-only</span>

That's if you see something like the following in your browser's console:
```
Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://app.forestadmin.com' is therefore not allowed access. The response had HTTP status code 404.
```
That happens when your CORS configuration is secured enough to the point that it does not allow
our UI to reach your application. To solve this issue, simply whitelist
<http://app.forestadmin.com> and <https://app.forestadmin.com> in your CORS
configuration.

## Liana update

### How can I update Forest to the newest version?
<span class="l-category l-category__forest">Forest-only</span>

Depending on your stack, you'll have to run one of the following commands:

* in **Rails**, run `$ bundle update --source forest_liana`
* in **Express/Sequelize**, run `$ npm install --save forest-express-sequelize@latest`
* in **Express/Mongoose**, run `$ npm install --save forest-express-mongoose@latest`

### How can I update Lumber to the newest version?
<span class="l-category l-category__lumber">Lumber-only</span>

Simply run the following command `$ npm install -g lumber-cli@latest`

### Have there been any major changes that I should be aware of?
<span class="l-category">All products</span>

A new version of Forest (2.0.0) has been released on November, 17. Important thing to know:
* Collection names in Forest_liana are now based on the model name.
<div class="c-notice warning l-mt">
  ⚠️ If you update to a version greater than or equal to 2.0.0, make sure you haven't received any warnings or error messages before deploying to production.
</div>

## JSON Web Token

### What about supporting custom authentification?
<span class="l-category">All products</span>

The admin API generated is protected using a JWT. You can use your own
authentication strategy for your app’s API (JWT or not). Both authentication
strategies are completely isolated.

## Uninstall

### How do I uninstall Forest?
<span class="l-category l-category__forest">Forest-only</span><span class="l-category l-category__rails">Rails</span>

If you made a clean install of Forest in a separate git commit, you can simply roll back to a previous commit.

Otherwise, you can always uninstall Forest manually:

* if you created custom actions, collections, fields or charts:
remove lib/forest_liana and the corresponding routes and files in app/controllers/forest
* remove the Forest route created in your config/route.rb file
* remove config/initializers/forest_liana.rb
* remove the gem from your gem file
* run bundle update

## Integrations

### Stripe integration
<span class="l-category">All products</span>

To enable the Stripe integration, make sure you have the following:

* a user collection in your models
* the correct identifier in the mapping attribute (see related doc: <http://doc.forestadmin.com/developers-guide/#stripe>)

