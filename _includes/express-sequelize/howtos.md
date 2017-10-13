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

To add a new team, go to your project settings -> Teams -> + New team and start inviting your teammates.

![Team permission 1](/public/img/team-permission-1.png "team-permission")

You can switch between teams by clicking on your avatar at the bottom left of your screen. Then, select the team you want to connect to. Once logged into a team, you can start customizing the interface of your team.

![Team permission 1](/public/img/team-permission-2.png "team-permission")

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
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Declare the route BEFORE the Forest Liana middleware</p>
  </div>
</div>

```javascript
app.delete('/forest/users/:recordId', function (req, res, next) {
  // Your business logic here.
});
```

Instead of reimplementing all the business logic of a method, you can call the
default behavior by invoking `next()`.

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
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Declare the route to the Express Router</p>
  </div>
</div>

```javascript
var liana = require('forest-express-sequelize');
var models = require('../models');

function impersonateToken(req, res, next) {
  // Find the user to impersonate
  models.user
    .findById(req.body.data.attributes.ids[0])
    .then((user) => {
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
  models.user
    .findById(payload.userId)
    .then((user) => {
      // Impersonate the user using Passport.js and redirect to the root of
      // the application.
      req.login(user, () => res.redirect('/'));
    });
}

router.post('/forest/actions/impersonate', liana.ensureAuthenticated,
  impersonateToken);

router.get('/forest/actions/impersonate', impersonate);
```

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
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">Your action is now visible</p>
  </div>
</div>

![Importing data 1](/public/img/importing-data-1.png "importing data 1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Handle the route</h2>
    <p class="l-step__description">Declare the route in the Express Router</p>
  </div>
</div>

In the following example, we use
[parse-data-uri](https://www.npmjs.com/package/parse-data-uri) and
[csv](https://www.npmjs.com/package/csv) NPM packages to parse the encoded
file. You should add it to your package.json too.

```javascript
const parseDataUri = require('parse-data-uri');
const csv = require('csv');

function bulkImport(req, res, next) {
  let parsed = parseDataUri(req.body.data.attributes.values.file);

  csv.parse(parsed.data, function (err, row) {
    // Your business logic to create your data here.

    res.send({ success: 'Data successfuly imported!' })
  });
}

router.put('/forest/actions/bulk-import', liana.ensureAuthenticated, updateMovie);
```

## Uploading images

Image uploading is one of the most common operations people do in their admin.
There's plenty of ways to handle it in your application. Forest supports natively
the most common file attachment libraries. In case you're not using one of
them, Forest gives you the flexibility to plug your own file upload business logic.

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
    <h2 class="l-step__title">Override the PUT method</h2>
    <p class="l-step__description">
      Declare the route before the Forest Express middleware
    </p>
  </div>
</div>

```javascript
var AWS = require('aws-sdk');

function randomFilename() {
  return require('crypto').randomBytes(48, function(err, buffer) {
    var token = buffer.toString('hex');
  });
}

function updateMovie(req, res, next) {
  // Create the S3 client.
  var s3Bucket = new AWS.S3({ params: { Bucket: process.env.S3_BUCKET }});

  // Parse the "data" URL scheme (RFC 2397).
  var rawData = req.body.data.attributes.pictureUrl;
  var base64Image = rawData.replace(/^data:image\/\w+;base64,/, '');

  // Generate a random filename.
  var filename = randomFilename();

  var data = {
    Key: filename,
    Body: new Buffer(base64Image, 'base64'),
    ContentEncoding: 'base64',
    ACL: 'public-read'
  };

  // Upload the image.
  s3Bucket.upload(data, function(err, response) {
    if (err) { return reject(err); }

    // Inject the new poster URL to the params.
    req.body.data.attributes.pictureUrl = response.Location;

    // Finally, call the default PUT behavior.
    next();
  });
};

router.put('/forest/movies/:movieId', liana.ensureAuthenticated, updateMovie);
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Express server</h2>
    <p class="l-step__description">File upload is now handled.</p>
  </div>
</div>

![Image upload 3](/public/img/image-upload-3.png "image upload 3")
