# How to's

## Deploying to production

Forest makes it really simple to deploy your admin to production.
<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create a new production environment</h2>
    <p class="l-step__description">Click "Deploy to production"</p>
  </div>
</div>
![Environment 1](/public/img/environment1.png "env")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Configure those environment variables</h2>
    <p class="l-step__description">On your production server</p>
  </div>
</div>

Provide your `FOREST_ENV_SECRET` (given by Forest) and the `FOREST_AUTH_SECRET` (random string) in the environment variables of your production server.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Deploy your code</h2>
    <p class="l-step__description">On your production server</p>
  </div>
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Copy layout</h2>
    <p class="l-step__description">Deploy your Forest UI configuration to your production environment</p>
  </div>
</div>

Now that you’re all set, you can duplicate the UI configuration of your development environment into your production environment to avoid having to repeat everything from the beginning. It will overwrite the default UI configuration.

Select your environment, click on “Deploy”, then "Save". You’re now ready to use Forest on production!

![Environment 2](/public/img/environment2.png "env")

## Managing team permissions

As a user with the "admin" role (See <a
href="/knowledge-base.html#users-roles-and-permissions" target="_blank">users,
roles and permissions</a>), you can create different teams.

Easily configure the interface of your teams to:
- Give limited access to your employees or contractors.
- Optimize the admin interface per business unit: success, support, sales or
  marketing teams.

![Team permission 1](/public/img/team-permission-1.png "team-permission")

To add a new team, go to project settings -> Teams -> + New team. Then, invite
your teammates, switch to the new team and start customizing the interface.

## Extending the Admin API

Forest provides instantly all the common tasks you need as an admin of your
application. Sometimes, these tasks are very specific to your business. Our
goal is to provide the simplest and most beautiful way to extend the default
behavior automatically implemented by the Liana. That's why the Liana only
generates a standard REST API. The learning curve to extend it is next to none,
meaning you can set up your own custom business logic in a matter of minutes.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Extend the Controller</h2>
    <p class="l-step__description">lib/forest_liana/controllers/user_controller.rb</p>
  </div>
</div>

```ruby
if ForestLiana::UserSpace.const_defined?('UserController')
  ForestLiana::UserSpace::UserController.class_eval do
    def update
      # your business logic here

      head :no_content
    end
  end
end
```

The previous example shows how to extend a `UPDATE` on a record. `list`, `get`,
`update`, `create` and `destroy` are the methods you can override or extend.

Instead of reimplementing all the business logic of a method, you can call the
default behavior by invoking your aliased method.

```ruby
if ForestLiana::UserSpace.const_defined?('UserController')
  ForestLiana::UserSpace::UserController.class_eval do
    alias_method :default_update, :update

    def update
      # your business logic here

      # Continue with the default implementation
      default_update

      head :no_content
    end
  end
end
```

The parameters (`params`) passed to the method includes the collection and the
ID of the record (except for the `list` method). A `before_filter` named
`find_resource` is executed before the method. This filter is in charge of
injecting to `@resource` the current model you are acting on.

## Impersonating a user

Implementing the impersonate action allows you to login as one of your users and
see exactly what they see on their screen.

The following example shows how to create an Impersonate Action on a
collection named `User`.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the "Impersonate" action</h2>
    <p class="l-step__description">
      More details can be found in the <a href="#creating-an-action">Creating an action</a> section.
    </p>
  </div>
</div>

![Impersonate 1](/public/img/impersonate-1.png "impersonate 1")

The impersonate process can be done in 2 steps:

- `POST '/actions/impersonate'` returns a generated URL with a JWT token
  as a query param. The token contains the user ID to impersonate and the
  details of the admin who triggered the action.
- `GET '/actions/impersonate?token=...'` verifies the JWT token, fetches the
  user from the database and configures the session depending on your
  authentication system.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the routes</h2>
    <p class="l-step__description">config/routes.rb</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/actions/impersonate' => 'actions#impersonate_token'
  get '/actions/impersonate' => 'actions#impersonate'
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/forest/actions_controller.rb</p>
  </div>
</div>

```ruby
class Forest::CustomersController < ForestLiana::ApplicationController
  skip_before_action :authenticate_user_from_jwt, only: [:impersonate]

  # Only if you use Pretender
  impersonates :user

  def impersonate_token
    # Find the user to impersonate.
    user = User.find(params['data']['attributes']['ids'].first)

    # Build the payload of the JWT token.
    payload = {
      user_id: user.id,
      admin_email: forest_user['data']['data']['email'],
      admin_teams: forest_user['data']['data']['teams']
    }

    # Generate the token using a random secret key.
    token = JWT.encode(payload, ENV['IMPERSONATE_SECRET_KEY'], 'HS256')

    # Respond with the URL.
    render json: {
      html: "<a href='http://localhost:3000/forest/actions/impersonate?token=#{token}'>"\

              "Login as #{user.email}</a>".html_safe
    }
  end

  def impersonate
    # Decode the JWT token.
    payload = JWT.decode(params['token'], ENV['IMPERSONATE_SECRET_KEY']).first

    # Fetch the user from the database.
    user = User.find(payload['user_id'])

    # Impersonate the user using the gem Pretender
    # (https://github.com/ankane/pretender).
    impersonate_user(user)

    # Redirect to the root page of the application.
    redirect_to '/'
  end

end
```

<div ng-show="currentStack === 'express/mongoose'" markdown="1">
  <div class="l-step l-mb l-pt">
    <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
    <div class="u-o-h">
      <h2 class="l-step__title">Handle the route</h2>
      <p class="l-step__description">Declare the route to the Express Router</p>
    </div>
  </div>

```javascript
var liana = require('forest-express-mongoose');

function impersonateToken(req, res, next) {

  // Find the user to impersonate
  User.findById(req.body.data.attributes.ids[0], (err, user) => {
    if (err) { return next(err); }

    // Build the payload of the JWT token
    var payload = {
      userId: user.id,
      adminEmail: req.user.data.email,
      adminTeams: req.user.data.teams,
    };

    // Generate the token using a random secret key
    var token = jwt.sign(payload, process.env.IMPERSONATE_SECRET_KEY);

    // Respond with the URL
    res.json({
      html: '<a href="http://localhost:3000/forest/actions/impersonate?token=' +
        token + '">Login as…</a>'
    });
  });
}

function impersonate(req, res, next) {
  // Decode the JWT token.
  var payload = jwt.verify(req.query.token, process.env.IMPERSONATE_SECRET_KEY);

  // Fetch the user from the database.
  User.findById(payload.userId, (err, user) => {
    if (err) { return next(err); }

    // Impersonate the user using Passport.js and redirect to the root of
    // the application.
    req.login(user, () => res.redirect('/'));
  });
}

router.post('/forest/actions/impersonate', liana.ensureAuthenticated,
  impersonateToken);

router.get('/forest/actions/impersonate', impersonate);
```
</div>

![Impersonate 2](/public/img/impersonate-2.png "impersonate 2")

## Importing data

Forest natively supports data creation but it's sometimes more efficient to
simply import it. This "How-to" shows a way to achieve that in your
Forest admin.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the "Bulk import" with 'File' type and the 'global' option set to true</h2>
    <p class="l-step__description">-> <a href="#handling-input-values">Smart Action - Handling input values</a></p>
  </div>
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">Your action is now visible</p>
  </div>
</div>

![Importing data 1](/public/img/importing-data-1.png "importing data 1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Declare the route</h2>
    <p class="l-step__description">config/routes.rb</p>
  </div>
</div>

```ruby
namespace :forest do
  post '/actions/bulk-import' => 'actions#bulk_import'
end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">4</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the controller</h2>
    <p class="l-step__description">app/controllers/forest/actions_controller.rb</p>
  </div>
</div>

In the following example, we use [data_uri](https://rubygems.org/gems/data_uri)
to parse the encoded file. You should add it to your Gemfile too.

```ruby
require 'data_uri'

class Forest::ActionsController < ForestLiana::ApplicationController

  def bulk_import
    uri = URI::Data.new(params.dig('data', 'attributes', 'values', 'file'))
    uri.data.force_encoding('utf-8')

    CSV.parse(uri.data).each do |row|
      # Your business logic to create your data here.
    end

    render json: { success: 'Data successfuly imported!' }
  end

end
```

## Uploading images

Image uploading is one of the most common operations people do in their admin.
There's plenty of ways to handle it in your application. Forest supports natively
the most common file attachment libraries. In case you're not using one of
them, Forest gives you the flexibility to plug your own file upload business logic.

[Paperclip](https://github.com/thoughtbot/paperclip) and
[CarrierWave](https://github.com/carrierwaveuploader/carrierwave) are both
well known libraries to manage file attachments in Rails. **Forest supports them
natively**, which means you don't need to configure anything more to upload and
crop your images in Forest.

The following example shows you how to handle the update of a record image. The
image field should be a string that contains the image URL. You have to
configure the _file picker_ widget on it.

![Image upload 1](/public/img/image-upload-1.png "image upload 1")

Having done that, your image is now rendered on your Details view. You can
upload a new one when editing your record and clicking on the image.
Optionally, you can also crop it.

![Image upload 2](/public/img/image-upload-2.png "image upload 2")

Hitting the _Apply changes_ button will update your record with your new image
encoded in base64 ([RFC 2397](https://tools.ietf.org/html/rfc2397)).

Now, you have to [extend the default behavior](#smart-business-logic) of the
`PUT` method on your admin API to upload your image where you want. The
following example shows you how to upload the image to AWS S3.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Override the update method</h2>
    <p class="l-step__description">
      app/decorators/controllers/forest_liana/resources_controller.rb
    </p>
  </div>
</div>

```ruby
ForestLiana::ResourcesController.class_eval do
  alias_method :default_update, :update

  # Regexp to match the RFC2397 prefix.
  REGEXP = /\Adata:([-\w]+\/[-\w\+\.]+)?;base64,(.*)/m

  def update
    # Create the S3 client.
    s3 = AWS::S3.new(access_key_id: ENV['S3_ACCESS_KEY'],
                     secret_access_key: ENV['S3_SECRET_KEY'])
    bucket = s3.buckets[ENV['S3_BUCKET']]

    # Parse the "data" URL scheme (RFC 2397).
    data_uri_parts = raw_data.match(REGEXP) || []

    # Upload the image.
    obj = bucket.objects.create(filename(data_uri_parts),
                                base64_image(data_uri_parts),
                                opts(data_uri_parts))

    # Inject the new poster URL to the params.
    url = obj.public_url().to_s
    params['resource']['data']['attributes']['poster'] = url
    params['data']['attributes']['poster'] = url

    # Finally, call the default PUT behavior.
    default_update
  end

  private

  def raw_data
    params['data']['attributes']['poster']
  end

  def base64_image(data_uri_parts)
    Base64.decode64(data_uri_parts[2])
  end

  def extension(data_uri_parts)
    MIME::Types[data_uri_parts[1]].first.preferred_extension
  end

  def filetype(data_uri_parts)
    MIME::Types[data_uri_parts[1]].first.to_s
  end

  def filename(data_uri_parts)
    ('a'..'z').to_a.shuffle[0..7].join + ".#{extension(data_uri_parts)}"
  end

  def opts(data_uri_parts)
    {
      acl: 'public_read',
      content_type: filetype(data_uri_parts)
    }
  end

end
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">File upload is now handled.</p>
  </div>
</div>

![Image upload 3](/public/img/image-upload-3.png "image upload 3")

