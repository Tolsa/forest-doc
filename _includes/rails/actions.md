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

In the following example, we add the *Ban user* action to the admin on
a collection *customers*. By default, the API triggered created by a Smart
Action is simply a POST on `/forest/actions/<dasherize_name_of_the_action>`.
You can customize the route with the optional parameter `endpoint` to get a
user friendly name and control the API call.

<div class="l-step">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the action in the collection schema</h2>
    <p class="l-step__description">lib/forest_liana/collections/customer.rb</p>
  </div>
</div>

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer
  action 'Ban user'
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">Your action is now visible on Forest</p>
  </div>
</div>

![Action 1](/public/img/action-1.png "img1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Configure CORS</h2>
    <p class="l-step__description">config/application.rb</p>
  </div>
</div>

We use the gem [rack-cors](https://rubygems.org/gems/rack-cors) for the CORS
configuration.

```ruby
class Application < Rails::Application
  # ...

  config.middleware.insert_before 0, 'Rack::Cors' do
    allow do
      origins 'app.forestadmin.com'
      resource '*', headers: :any, methods: :any
    end
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb (add the route before the Forest engine)</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/actions/ban-user' => 'customers#ban_user'
end

# ...
# mount ForestLiana::Engine => '/forest'
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">5</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/forest/customers_controller.rb</p>
  </div>
</div>

```ruby
# ForestLiana::ApplicationController takes care of the authentication for you.
class Forest::CustomersController < ForestLiana::ApplicationController
  def ban_user
    # Your business logic to send an email here.
    head :no_content
  end
end
```

## Handling input values

You can declare the list of fields when your action requires parameters from the Human in front of the screen. Available options for each `field` are:

- Add a `description` that will help humans understand what value is expected.

- Determine whether a field is to be `required` or not.

- Set a `default value`.

- Add a `widget` to provide a simple and easy-to-use way of entering value for
  your end-users. Five widgets are currently supported: `JSON editor`, `rich
  text editor`, `date picker`, `text area`, `text input`.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the form fields to your action</h2>
    <p class="l-step__description">lib/forest_liana/collections/review.rb</p>
  </div>
</div>

```ruby
class Forest::Review
  include  ForestLiana::Collection

  collection :Review
  action 'Approve', fields: [{
    field: 'Comment',
    type: 'String',
    description: "Personal description",
    isRequired: true,
    defaultValue: 'I approve this comment'
    widget: 'text area'
  }]
end
```

<br>

Six types of field are currently supported: `Boolean`, `Date`, `Number`,
`String`, `File` and `Enum`. If you choose the `Enum` type, you can pass the
list of possible values through the `enums` key:

```ruby
{ field: 'Country', type: 'Enum', enums: ['USA', 'CA', 'NZ'] }
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
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

You can also display a custom html page as a response using `{ html: '<h1>Congratulations!</h1><p>The comment has been successfully approved</p> ... ... ...'}`.

![Action 2](/public/img/action-6.png)

## Downloading a file

The response of an action will be considered as a file to download if you pass
the option 'download' to the action declaration. It's very useful if you need
actions like "Generate an invoice" or "Download PDF".

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the download option to your action</h2>
    <p class="l-step__description">/lib/forest_liana/collections/customer.rb</p>
  </div>
</div>

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer
  action 'Download file', download: true
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Configure CORS</h2>
    <p class="l-step__description">config/application.rb</p>
  </div>
</div>

We use the gem [rack-cors](https://rubygems.org/gems/rack-cors) for the CORS
configuration.

```ruby
class Application < Rails::Application
  # ...

  config.middleware.insert_before 0, 'Rack::Cors' do
    allow do
      origins 'app.forestadmin.com'
      resource '*',
        methods: :any,
        headers: :any,
        expose: ['Content-Disposition']
    end
  end
end
```

<div class="c-notice warning l-mt">
  ⚠️ If you forget to specify "expose: ['Content-Disposition']" in the CORS configuration, the filename of the downloaded file won't be customisable as described in the step 4.
</div>


<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb (add the route before the Forest engine)</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/actions/download-file' => 'customers#download_file'
end

# ...
# mount ForestLiana::Engine => '/forest'
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Send the file as a response</h2>
    <p class="l-step__description">app/controllers/forest/customers_controller.rb</p>
  </div>
</div>

```ruby
class Forest::CustomersController < ForestLiana::ApplicationController
  def download_file
    # TODO: Add a "myLocalFile.pdf" file at the root of your project to have a working example.
    data = open('myLocalFile.pdf')
    send_data data.read, filename: 'myfile.pdf', type: 'application/pdf',
      disposition: 'attachment'
  end
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
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
    <h2 class="l-step__title">Add the global option to your action</h2>
    <p class="l-step__description">/lib/forest_liana/collections/customer.rb</p>
  </div>
</div>

```ruby
class Forest::Customer
  include ForestLiana::Collection

  collection :Customer
  action 'Import data', global: true
end
```

![Action 4](/public/img/action-4.png)
