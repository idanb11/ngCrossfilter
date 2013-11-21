ngCrossfilter
=============

Introduction
-------------

Angular uses native JavaScript methods for sorting, whereas `ngCrossfilter` uses <a href="https://github.com/square/crossfilter" target="_blank">Crossfilter</a> for a significant improvement in performance. It introduces an intuitive microsyntax for filtering which is simple to get to grips with.

Getting Started
-------------

Filtering for `ngCrossfilter` is performed in your HTML template as you do with other Angular filters.

```html
<li ng-repeat="book in books | crossfilter: { filter: 'name', value: '1984', sort: 'id', direction: 'asc' }">
```

<table>
    <tr>
        <th>Property</th>
        <th>Behaviour</th>
    </tr>
    <tr>
        <td><code>filter</code></td>
        <td>Property to apply the filter to.</td>
    </tr>
    <tr>
        <td><code>value</code></td>
        <td>Value to use for the filter &ndash; see <a href="#microsyntax">microsyntax</a>.</td>
    </tr>
    <tr>
        <td><code>sort</code></td>
        <td>Property to use for the sorting.</td>
    </tr>
    <tr>
        <td><code>direction</code></td>
        <td>Direction of the sorting - <code>asc</code>/<code>desc</code></td>
    </tr>
</table>

As is typical with Angular, if you update any of the properties then the filtering and sorting will automatically change. Each property should ideally be set with a variable as opposed to an explicit string.

Filtering Microsyntax
-------------

Since Crossfilter allows you to filter data in different ways, `ngCrossfilter` introduces an easy-to-learn microsyntax to apply different types of filters using the `value` property.

Mostly the filtering strategy is based on the leading character of the filter string.

<h4>Exact Match</h4>

```html
<li ng-repeat="book in books | crossfilter: { filter: 'name', value: 'Brave New World' }">
```

Property `name` on the collection has to be exactly **Brave New World**.

<h4>Fuzzy Match</h4>

```html
<li ng-repeat="book in books | crossfilter: { filter: 'name', value: '~Brave' }">
```

Property `name` on the collection has to contain **Brave New World**.

<h4>Expression Match</h4>

```html
<li ng-repeat="book in books | crossfilter: { filter: 'name', value: '~/World/i' }">
```

Property `name` on the collection has to match regular expression.

```html
<li ng-repeat="book in books | crossfilter: { filter: 'id', value: [1, 6] }">
```

Property `id` on the collection has to be between `1` and `6`.