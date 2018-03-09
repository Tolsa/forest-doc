# Views

## What is a view?

A view is simply the way to visualize your data in the Forest UI. By default,
Forest renders your data using a table view when you access multiple records
and a form view to access, edit and create a specific record.

## What is a Smart View?
<span class="l-category l-category__pro">Premium feature</span>

Smart Views lets you code your view using JS, HTML, and CSS. They are taking
data visualization to the next level. Ditch the table view and display your
orders on a Map, your events in a Calendar, your movies, pictures and profiles
in a Gallery. All of that with the easiness of Forest.

![Map View 1](/public/img/map-view-1.png "map view 1")

## Creating a Smart View

Forest provides an online editor to inject your Smart View code. The editor is
available on the collection settings of a collection, then in the "Smart views"
tab.

The code of a Smart View is a <a
href="https://www.emberjs.com/api/ember/2.15.0/classes/Ember.Component">Ember
Component</a> and simply consists of a template and a Javascript.

The template is written using Handlebars. Don't panic <a
href="https://guides.emberjs.com/v2.15.0/templates/handlebars-basics">it's
very simple</a>.

![Smart View 1](/public/img/smart-view-1.png "smart view 1")
Collection settings -> Smart Views.

## Getting your records

The records of your collection is accessible in the `records` property.
Here's how to iterate over them in the template section:

<div ng-non-bindable markdown="1">
{% raw %}
```
{{#each records as |record|}} 
{{/each}} 
```
{% endraw %}
</div>

## Accessing a specific record

For each record, you will access its attributes through the
`forest-attributeName` property. The `forest-` preceding the field name
**is required**.

<div ng-non-bindable markdown="1">
{% raw %}
```
<p>
  {{record.forest-firstName}}
</p>
```
{% endraw %}
</div>

## Accessing belongsTo relationships

Accessing a `belongsTo` relationship is exactly the same way than accessing a
simple field. Forest triggers automatically an API call to retrieve the data
from your Admin API only if it's necessary. Let's take the following schema
example and display the `address` field of the related `Customer`.

<img src="/public/img/smart-collection-2.png" alt="Smart collection" class="img--retina">

<div ng-non-bindable markdown="1">
{% raw %}
```
<p>
  {{record.forest-order.forest-customer.forest-address}}
</p>
```
{% endraw %}
</div>

## Accessing hasMany relationships

Accessing a `hasMany` relationship is exactly the same way than accessing a
simple field. Forest triggers automatically an API call to retrieve the data
from your Admin API only if it's necessary. Let's take the following schema
example and display the `available_at` field of the related `Menu`.

<img src="/public/img/smart-collection-3.png" alt="Smart collection" class="img--retina">

<div ng-non-bindable markdown="1">
{% raw %}
```
{{#each record.forest-menus as |menu|}}
  <p>{{menu.forest-available_at}}</p>
{{/each}}
```
{% endraw %}
</div>

## Refreshing data

In order to refresh the records on the page, trigger the `fetchRecords` action:

<div ng-non-bindable markdown="1">
{% raw %}
```
<button {{action 'fetchRecords'}}>
  Refresh data
</button>
```
{% endraw %}
</div>

## Fetching data

Trigger an API call to your Admin API in order to fetch records from any
collection of your admin.

We will use the `store` service directly available from your javascript file to
do that:

```javascript
'use strict';
import Ember from 'ember';

export default Ember.Component.extend({
  // ...
  store: Ember.inject.service('store'),
  fetchData: function () {
    let params = {
      filter: {
        'available_at': '>' + moment().startOf('isoWeek').toISOString(), // Beginning of this week
                        ',<' + moment().endOf('isoWeek').toISOString(), // End of this week
      },
      filterType: 'and',
      timezone: 'Europe/Paris',
      'page[size]': 100
    };

    // This will trigger an API call to your Admin API.
    this.get('store').query('forest_chef-availability', params)
      .then((availabilities) => {
        this.set('availabilities', availabilities);
      });
  }.on('init'),
  / ...
});
```

In the example above, the result is set to the variable `availabilities`. You can access it directly from your template:

<div ng-non-bindable markdown="1">
{% raw %}
```
{{#each availabilities as |availability|}}
  <p>{{availability.id}}</p>
{{/each}}
```
{% endraw %}
</div>

<br>

A full working example is available in the [Calendar
example](#example-calendar-view).

### Available parameters

- filter: A list of filter you want to apply. Syntax is a javascript object
  that contains `<field>: '<operator><value>,<operator><value>,...'`
- filterType: `and` or `or`
- timezone: The timezone string
- page[number]: The page number
- page[size]: The number of records per page

## Deleting records

The `deleteRecords` action lets you delete one or multiple records. A panel
will automatically ask for a confirmation when a user triggers the delete
action.

<div ng-non-bindable markdown="1">
{% raw %}
```
<button {{action 'deleteRecords' record}}>
  Delete record
</button>
```
{% endraw %}
</div>

## Triggering a Smart Action

Here's how to trigger your <a href="#actions">Smart Actions</a> directly from
your Smart Views:

<div ng-non-bindable markdown="1">
{% raw %}
```
<button {{action 'triggerSmartAction' collection 'Generate invoice' record}}>
  Generate invoice
</button>
```
{% endraw %}
</div>

You can pass an array or a single record.

## Available properties

- `collection` (Model): The current collection.
- `currentPage` (Number): The current page.
- `isLoading` (Boolean): Indicates if the UI is currently loading `records` or
- `numberOfPages` (Number): The total number of available pages.
- `records` (Array): Your data entries.
- `searchValue` (String): The current search.

## Examples

Try it out with one these 3 examples (each one taking about 10 minutes):

- [Map view](#example-map-view)
- [Calendar view](#example-calendar-view)
- [Gallery view](#example-gallery-view)

### Example: Map view

![Map View 1](/public/img/map-view-1.png "map view 1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart View</h2>
    <p class="l-step__description">Open the Collection settings - Smart Views</p>
  </div>
</div>


<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the template</h2>
    <p class="l-step__description">TEMPLATE</p>
  </div>
</div>

```
<style>
  #map {
    width: 100%;
    z-index: 4;
  }
</style>


<div id="map"></div>
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the javascript</h2>
    <p class="l-step__description">JAVASCRIPT</p>
  </div>
</div>

```javascript
'use strict';
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  router: Ember.inject.service('-routing'),
  map: null,
  loaded: false,
  loadPlugin: function() {
    var that = this;
    Ember.run.scheduleOnce('afterRender', this, function () {
      Ember.$.getScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.js', function () {
        that.set('loaded', true);
      });

      var cssLink = $('<link>');
      $('head').append(cssLink);

      cssLink.attr({
        rel:  'stylesheet',
        type: 'text/css',
        href: '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css'
      });
    });
  }.on('init'),
  displayMap: function () {
    if (!this.get('loaded')) { return; }

    var markers = [];
    $('#map_canvas').height($('.l-content').height());

    this.get('records').forEach(function (record) {
      var split = record.get('forest-geoloc').split(',');
      markers.push([split[0], split[1], record.get('id')]);
    });

    this.map = new L.Map('map');

    var osmUrl='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });

    this.map.setView(new L.LatLng(37.7869148, -122.3998675), 13);
    this.map.addLayer(osm);

    this.addMarker(markers);
  }.observes('records.[]', 'loaded').on('didInsertElement'),
  addMarker: function (markers) {
    var that = this;

    markers.forEach(function (marker) {
      var lat = parseFloat(marker[0]);
      var lng = parseFloat(marker[1]);

      var recordId = marker[2];
      var record = that.get('records').findBy('id', recordId);
      var displayValue = record.get(
        that.get('collection.displayFieldWithNamespace')) ||
        record.get('forest-email') || record.get('id');

      marker = L.marker([lat, lng]).addTo(that.map);

      marker.bindPopup('<strong>Delivery man</strong><p>' + displayValue + '</p>')

      marker.on('mouseover', function (e) { this.openPopup(); });
      marker.on('mouseout', function (e) { this.closePopup(); });
      marker.on('click', function () {
        that.get('router')
          .transitionTo('rendering.data.collection.list.viewEdit.details',
            [that.get('collection.id'), recordId]);
      });

      setInterval(function () {
        marker.setLatLng(new L.latLng(lat -= 0.0001, lng -= 0.0001));
      }, Math.floor(Math.random() * 2000) + 300);
    });
  }
});

```

<br>
Having done that, your Map view is now rendered on your list view.

### Example: Calendar view
<span class="counter" target="example-calendar-view" counter="600"></span>

![Calendar View 1](/public/img/calendar-view-1.png "calendar view 1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Smart View</h2>
    <p class="l-step__description">Open the Collection settings - Smart Views</p>
  </div>
</div>


<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the template</h2>
    <p class="l-step__description">TEMPLATE</p>
  </div>
</div>

```
<style>
  #calendar {
    padding: 20px;
    background: white;
    height:100%
  }

  #calendar .fc-toolbar.fc-header-toolbar .fc-left {
    font-size: 14px;
    font-weight: bold;
  }

  #calendar .fc-day-header {
    padding: 10px 0;
    background-color: #f7f7f7;
  }

  #calendar .fc-time {
    background-color: #f7f7f7;
  }

  #calendar .fc-event {
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    color: #555;
    font-size: 14px;
  }
</style>

<div id='calendar'></div>
```

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the javascript</h2>
    <p class="l-step__description">JAVASCRIPT</p>
  </div>
</div>

```javascript
'use strict';
import Ember from 'ember';

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  store: Ember.inject.service('store'),
  loaded: false,
  loadPlugin: function() {
    var that = this;
    Ember.run.scheduleOnce('afterRender', this, function () {
      Ember.$.getScript('//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar.min.js', function () {
        that.set('loaded', true);

        $('#calendar').fullCalendar({
          defaultView: 'agendaWeek',
          allDaySlot: false,
          minTime: '08:00:00',
          eventClick: function (event, jsEvent, view) {
            that.get('router')
              .transitionTo('rendering.data.collection.list.viewEdit.details',
                [that.get('collection.id'), event.id]);
          },
          viewRender: function(view, element) {
            let params = {
              filter: {
                'available_at': '>' + view.start.toISOString() +
                                ',<' + view.end.toISOString()
              },
              filterType: 'and',
              timezone: 'Europe/Paris',
              'page[size]': 100
            };

            that.get('store')
              .query('forest_chef-availability', params)
              .then((availabilities) => {
                that.set('availabilities', availabilities);
              });
          }
        });
      });

      var cssLink = $('<link>');
      $('head').append(cssLink);

      cssLink.attr({
        rel:  'stylesheet',
        type: 'text/css',
        href: '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.1.0/fullcalendar.min.css'
      });
    });
  }.on('init'),
  setEvent: function () {
    if (!this.get('availabilities')) { return; }

    var events = [];
    $('#calendar').fullCalendar('removeEvents');

    this.get('availabilities').forEach(function (availability) {
      var event = {
        id: availability.get('forest-chef').get('id'),
        title: availability.get('forest-chef').get('forest-lastname'),
        start: availability.get('forest-available_at')
      };

      $('#calendar').fullCalendar('renderEvent', event, true);
    });
  }.observes('loaded', 'availabilities.[]')
});
```

<br>
Having done that, your Calendar view is now rendered on your list view.

### Example: Gallery view
<span class="counter" target="example-gallery-view" counter="600"></span>

![Gallery View 1](/public/img/gallery-view-1.png "gallery view 1")

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">1</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Create the Gallery view</h2>
    <p class="l-step__description">Open the Collection settings - Smart Views</p>
  </div>
</div>


<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">2</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the template</h2>
    <p class="l-step__description">TEMPLATE</p>
  </div>
</div>

<div ng-non-bindable markdown="1">
{% raw %}
```
<style>
  .c-movies.l-table--content {
    text-align: center;
    margin-top: 15px;
    margin-bottom: 50px;
    overflow-y: auto;
  }

  .c-movies__image img {
    height: 350px;
    width: 250px;
    margin: 3px;
    border: 1px solid #bbb;
    border-radius: 3px;
		transition: all .3s ease-out;
  }

  .c-movies__image:hover {
    transform: scale(1.05);
  }
</style>

<section class="l-view__element l-view__element--table u-f-g c-movies l-table l-table--content">
  <div>
    {{#each records as |record|}}
      {{#link-to 'rendering.data.collection.list.viewEdit.details' collection.id record.id class="c-movies__image"}}
        <img class="c-movies__image" src={{record.forest-poster}}>
      {{/link-to}}
    {{/each}}
  </div>
</section>

{{table/table-footer records=records currentPage=currentPage
  fetchPage="fetchPage" currentUser=currentUser customView=customView
  updateRecordPerPage="updateRecordPerPage" collection=collection
  numberOfPages=numberOfPages fetchRecords="fetchRecords"}}
```
{% endraw %}
</div>

<div class="l-step l-mb l-pt">
  <span class="l-step__number l-step__number--active u-f-l u-hm-r">3</span>
  <div class="u-o-h">
    <h2 class="l-step__title">Implement the javascript</h2>
    <p class="l-step__description">JAVASCRIPT</p>
  </div>
</div>

```javascript
'use strict';
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    updateRecordPerPage() {
      this.get('customView')
        .save()
        .then(() => this.sendAction('fetchRecords'));
    },
    fetchRecords(olderOrNewer) {
      this.sendAction('fetchRecords', olderOrNewer);
    }
  }
});
```

<br>
Having done that, your Gallery view is now rendered on your list view.
