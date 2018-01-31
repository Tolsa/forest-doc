# Integrations

Forest is able to leverage data from third party services by reconciliating it
with your application's data, providing it directly to your admin.
All your admin actions can be performed at the same place,
bringing additional intelligence to your admin and ensuring consistency.

## Intercom
<span class="l-category l-category__pro">Premium feature</span>

Configuring the Intercom integration for Forest allows you to have your user's
session data (location, browser type, ...) and support conversations directly
alongside the corresponding user from your application.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the Intercom integration</h2>
    <p class="l-step__description">config/initializers/forest_liana.rb</p>
  </div>
</div>

```ruby
# ...
ForestLiana.integrations = {
  intercom: {
    access_token: 'YOUR_INTERCOM_ACCESS_TOKEN',
    mapping: 'User'
  }
}
```

<div class="c-notice warning l-mt">
  ⚠️ The integration needs an "extended" Intercom Access token to let the Forest liana read users and conversations.
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">Intercom is now plugged to Forest</p>
  </div>
</div>

![Intercom 1](/public/img/intercom-1.png)

## Stripe
<span class="l-category l-category__pro">Premium feature</span>

Configuring the Stripe integration for Forest allows you to have your user's
payments, invoices and cards alongside the corresponding user from your
application. A refund action is also available out-of-the-box on the
`user_collection` configured.

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Add the Stripe integration</h2>
    <p class="l-step__description">config/initializers/forest_liana.rb</p>
  </div>
</div>

```ruby
# ...
ForestLiana.integrations = {
  stripe: {
    api_key: 'YOUR_STRIPE_SECRET_KEY',
    mapping: 'User.stripe_id'
  }
}
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Restart your Rails server</h2>
    <p class="l-step__description">Stripe is now plugged to Forest</p>
  </div>
</div>

![Stripe 1](/public/img/stripe-1.png)
