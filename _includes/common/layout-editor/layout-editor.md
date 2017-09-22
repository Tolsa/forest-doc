# Layout Editor

The Layout Editor is an essential tool to <a
href="#managing-team-permissions">manage your teams permissions</a> and
optimize the admin interface of each business units.

No coding required, you can directly configure the interface directly using the
Forest Layout Editor.

![Layout Editor 1](/public/img/layout-editor-1.gif "layout editor 1")

This feature is available for `admin` and `editor` <a
href="/knowledge-base.html#users-roles-and-permissions"
target="_self">roles</a> only.

<div class='c-notice info'>
  Note that if you change your admin configuration, it will be reflected on
  the entire team on which you are currently logged in (e.g. if you hide a
  collection within the "Admin" team, all users of this team will no longer see
  this collection).
</div>

## Showing, hiding and re-ordering collections

You may want to display only relevant information to your teammates. Sometimes,
sensible data shouldn't be exposed to everyone within your company.

In the navigation sidebar containing your collections, activate the layout
editor to:
- reorder collections by drag and drop
- hide or show collections by checking or not the box next to your collection
  name.

![Layout Editor 2](/public/img/layout-editor-2.gif "layout editor 2")

## Showing, hiding and re-ordering fields

In the same way as for collections, for the sake of clarity for operations, you
can activate the layout editor to:
- reorder fields by drag and drop
- hide or show fields that are not relevant (e.g. id, updated_at) by checking
  or not the box next to your collection name.

![Layout Editor 3](/public/img/layout-editor-3.gif "layout editor 3")

## Collection settings

If you've activated the Layout Editor, you've certainly noticed the orange
“cog” icon beside each collection name in the navigation sidebar. Clicking on
this icon give you access to your collection settings.

Let's take a closer look at each of these settings...

### General

This is where you can rename your collection to make it more user-friendly, set
a nice icon, change the default sorting (e.g. created_at) and more.

![Layout Editor 4](/public/img/layout-editor-4.png "layout editor 4")

### Fields

In the Fields section of your collection settings, you'll be able to:
- change the display name of your field.
- add a descritpion to your field for a clearer explanation.
- set the field in read-only mode so that users won't be able to modify it.
- choose from a list of widget to better display your data (`google map`, `rich
  text editor`, `file picker`, `document viewer` and more).

![Layout Editor 5](/public/img/layout-editor-5.png "layout editor 5")

### Segments

In this section, you can create <a href="#segments-1"
target="_self">segments</a> on your collections.

Segments are made for those who are willing to systematically visualize data
according to specific sets of filters. It allows you to save your filters
configuration so that you don’t have to compute the same actions every day
(e.g. signup this week, pending transactions).

![Layout Editor 6](/public/img/layout-editor-6.png "layout editor 6")

If you're looking to implement a more complex segment, you might want to take a
look at <a href="#creating-a-smart-segment" target="_self">Smart Segments</a>.

### Smart Actions

<a href="#what-is-a-smart-action" target="_blank">Smart actions</a> are
specific to your business. A smart action can be triggered from a record (e.g.
user, company) or from the collection.

In the Smart Actions section of your collection settings you have 3 options:
- display or not the action to restrict the access from your teammates
- ask for confirmation before triggering the action
- make the action visible on some segments only

![Layout Editor 7](/public/img/layout-editor-7.png "layout editor 7")

### Smart Views

In this section you can configure your <a href="#what-is-a-smart-view"
target="_blank">Smart Views</a> using JS, HTML, and CSS.

To make a specific smart view as a default view, click on your collection,
activate the layout editor, and drag and drop your view to the top at the top
right of your screen.

![Layout Editor 8](/public/img/layout-editor-8.png "layout editor 8")
