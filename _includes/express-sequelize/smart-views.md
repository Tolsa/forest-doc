# Smart Views

Smart Views are taking data visualization to the next level. Ditch the table
view and display your orders on a Map, your events in a Calendar, your movies,
pictures and profiles in a Gallery. All of that with the easiness of Forest.

![Map View 1](/public/img/map-view-1.png "map view 1")


## What is a Smart View?

A Smart View replaces the standard table view for a collection. It allows you
to display data in a way that is best suited for its usage by your teams.

Common use case Smart Views are already available for you to deploy immediately
by plugging in your data.


Try it out with one these 3 examples (each one taking about 10 minutes):

- [Map view](#example-map-view)
- [Calendar view](#example-calendar-view)
- [Gallery view](#example-gallery-view)

If you need more customization you can easily tweak one or build your own. Just
add your own JS, HTML and CSS through an easy and standard <a href="https://guides.emberjs.com/v2.12.0/components/defining-a-component/" target="_blank">Ember.js Component</a>,
and Forest will inject dynamically in the UI.


## The four bullet points to master the Smart View

- You will add your HTML and CSS to the TEMPLATE section and your JS code to
  the JAVASCRIPT section.

- When writing your Component, access your data using the `records` property
  made available by Forest with your collection, as such:

<div ng-non-bindable markdown="1">
{% raw %}
```
{{#each records as |record|}} 
  <div>{{record.forest-firstName}}</div> 
  <div>{{record.forest-lastName}}</div> 
  <div>{{record.forest-location}}</div> 
{{/each}} 
```
{% endraw %}
</div>


- For each record, you will access its attributes through the
  `.forest-**attributeName**` method. (The `forest-` preceding the attribute
  name is required).

- Forest makes available 6 properties and 3 actions on the view to help you
  make it truly smart, as well as some pre-built Ember blocks that won't
  require you to do anything for most of the commonly used actions, and they
  are listed below.


### Available Blocks
Some plug and play Ember blocks for common actions in Smart Views.

- A page selector to deal with records pagination:

<div ng-non-bindable markdown="1">
{% raw %}
```
{{table/table-footer records=records currentPage=currentPage
fetchPage="fetchPage" currentUser=currentUser customView=customView
updateRecordPerPage="updateRecordPerPage" collection=collection
numberOfPages=numberOfPages fetchRecords="fetchRecords"}}
```
{% endraw %}
</div>

- In order to refresh the records on the page, use:

<div ng-non-bindable markdown="1">
{% raw %}
```html
<button {{action 'fetchRecords'}}>
  Refresh data
</button>
```
{% endraw %}
</div>
- To delete records, use:

<div ng-non-bindable markdown="1">
{% raw %}
```html
<button {{action 'deleteRecords' record}}>
  Delete record
</button>
{% endraw %}
```
</div>

You can pass an array or a single record.

- To trigger a custom action on some records, use:

<div ng-non-bindable markdown="1">
{% raw %}
```html
<button {{action 'triggerSmartAction' collection 'Generate invoice' record}}>
  Generate invoice
</button>
```
{% endraw %}
</div>

You can pass an array or a single record.


### Available properties
- `collection` (Model): The current collection.
- `currentPage` (Number): The current page.
- `isLoading` (Boolean): Indicates if the UI is currently loading `records` or
- `numberOfPages` (Number): The total number of available pages.
- `records` (Array): Your data entries.
- `searchValue` (String): The current search.

### Where to paste code

![Smart View 1`](/public/img/smart-view-1.png)


## Example: Map view

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
  #map_canvas { width: 100%; }
</style>

<div id="map_canvas"></div>
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
  displayMap: function () {
    var markers = [];
    $('#map_canvas').height($('.l-content').height());

    this.get('records').forEach(function (record) {
      var split = record.get('forest-geoloc').split(',');
      markers.push([split[0], split[1], record.get('id')]);
    });

    var geocoder = new window.google.maps.Geocoder();
    var latlng = new window.google.maps.LatLng(37.7869148, -122.3998675);
    var myOptions = {
      zoom: 13,
      center: latlng,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    };

    this.map = new window.google.maps.Map(
      window.document.getElementById('map_canvas'), myOptions);

    this.addMarker(markers);
  }.observes('records.[]').on('didInsertElement'),
  addMarker: function (markers) {
    var that = this;

    markers.forEach(function (marker) {
      var lat = parseFloat(marker[0]);
      var lng = parseFloat(marker[1]);
      var myLatlng = new window.google.maps.LatLng(lat, lng);
      var recordId = marker[2];
      var record = that.get('records').findBy('id', recordId);
      var displayValue = record.get(
        that.get('collection.displayFieldWithNamespace')) ||
        record.get('forest-email') || record.get('id');

      var infowindow = new window.google.maps.InfoWindow({
        content: '<strong>' + that.get('collection.displayName') +
          '</strong><p>' + displayValue + '</p>'
      });
      var markerObj = new window.google.maps.Marker({
        position: myLatlng,
        map: that.get('map')
      });

      markerObj.addListener('click', function () {
        that.get('router')
          .transitionTo('rendering.data.collection.list.viewEdit.details',
            [that.get('collection.id'), recordId]);
      });

      markerObj.addListener('mouseover', function () {
        infowindow.open(that.get('map'), this);
      });

      markerObj.addListener('mouseout', function () {
        infowindow.close();
      });
    });
  }
});

```

<br>
Having done that, your Map view is now rendered on your list view.

## Example: Calendar view
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
            that.get('router').transitionTo('rendering.data.collection.list.viewEdit.details', [that.get('collection.id'), event.id]);
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
    var events = [];
    $('#calendar').fullCalendar('removeEvents');

    this.get('records').forEach(function (chef) {
      chef.get('forest-chef_availabilities').then(function (availabilities) {
        availabilities.forEach(function (availability) {
          var event = {
            id: chef.get('id'),
            title: chef.get('forest-lastname'),
            start: availability.get('forest-available_at')
          };

          $('#calendar').fullCalendar('renderEvent', event, true);
        });
      });
    });
  }.observes('loaded', 'records.[]')
});
```

<br>
Having done that, your Calendar view is now rendered on your list view.

## Example: Gallery view
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

