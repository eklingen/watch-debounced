
# Simple debounced file watcher

Simple debounced file watcher. Uses Chokidar. This does not queue events, it simply rate limits them.

> *NOTE:* No tests have been written yet!

## Installation

`yarn install`. Or `npm install`. Or just copy the files to your own project.

## Usage

Specify either a folder or a glob. You can specify options or an empty object. It returns the `chokidar` instance, so you can close it at a later time.

```javascript
const watch = require('@eklingen/watch-debounced')
const watcher = watch('folder-or-glob/**/*', {}, (event, path) => yourCallback(event, path))
...
watcher.close()
```

The callback `yourCallback` is called with the following arguments:

- `event` string (example: `'change'`)
  - all events
- `path` string (example: `/Users/batman/my/secret/stash.zip`)
  - all events, except `ready` and `error`
- `stats` or `details` string (optional)
  - only `change` or `raw` events
- `error` object
  - only `error` event

The `raw` event is internal to `chokidar` and may change at any moment.

## Options

There are a few options.

### `delay`

Set a delay in millisecond before the timeout resets. Default is `250`.

```javascript
watch('my-stuff/', {
  delay: 250
}, () => yourCallback())
```

### `events`

The events to watch for. Default is `[ 'add', 'change', 'unlink' ]`. For more events, see the ["chokidar"](https://www.npmjs.com/package/chokidar) documentation.

```javascript
watch('my-stuff/', {
  events: [ 'add', 'change', 'unlink' ]
}, () => yourCallback())
```

### `fireFirst` and `fireLast`

If `fireFirst` is set, the callback is triggered separately before the debounce. Default is `false`. If `fireLast` is set, the callback is triggered after the debounce. Default is `true`. Enabling both is possible, disabling both is useless.

```javascript
watch('my-stuff/', {
  fireFirst: false,
  fireLast: true
}, () => yourCallback())
```

### `chokidarOptions`

This object is passed verbatim to `chokidar`. For all options, see the ["chokidar"](https://www.npmjs.com/package/chokidar) documentation.

## Dependencies

This package requires ["chokidar"](https://www.npmjs.com/package/chokidar).

---

Copyright (c) 2019 Elco Klingen. MIT License.
