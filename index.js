// Simple debounced file watcher. Uses Chokidar.

const DEFAULT_OPTIONS = {
  delay: 250,
  events: ['add', 'change', 'unlink'],
  fireFirst: false,
  fireLast: true,
  chokidarOptions: {
    ignoreInitial: true,
    followSymlinks: false
  }
}

function watch (paths = [], options = {}, callback = () => {}) {
  options = { ...DEFAULT_OPTIONS, ...options }

  const chokidar = require('chokidar')
  const watcher = chokidar.watch(paths, options.chokidarOptions)

  const debounceEvent = (callback, time = DEFAULT_OPTIONS.delay, interval) => (...args) => {
    clearTimeout(interval)
    interval = setTimeout(() => options.fireLast ? callback(...args) : () => {}, time)
  }

  function onChange (event, path, stats, error) {
    if (error && watcher.listenerCount('error')) {
      watcher.emit('error', error)
      return
    }

    if (options.fireFirst) {
      callback(event, path, stats)
    }

    debounceEvent(callback(event, path, stats), 250)
  }

  options.events.forEach(event => {
    if (['add', 'change', 'unlink', 'addDir', 'unlinkDir'].indexOf(event) !== -1) {
      watcher.on(event, path => onChange(event, path, null, null))
    } else if (event === 'change') {
      watcher.on(event, (path, stats) => onChange(event, path, stats, null))
    } else if (event === 'error') {
      watcher.on(event, error => onChange(event, '', null, error))
    } else if (event === 'ready') {
      watcher.on(event, () => onChange(event, '', null, null))
    } else if (event === 'raw') {
      watcher.on(event, (event, path, details) => onChange(event, path, details, null))
    }
  })

  return watcher
}

module.exports = watch
