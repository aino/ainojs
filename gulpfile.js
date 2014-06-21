var gulp = require('gulp')
var gutil = require('gulp-util')
var fs = require('fs')
var es = require('event-stream')
var browserify = require('browserify')
var map = require('vinyl-map')
var source = require('vinyl-source-stream')
var buffer = require('gulp-buffer')
var concat = require('gulp-concat')
var watch = require('gulp-watch')

/*
foreach test as name
  browserify(../name.js) && name.js as script
  return html script

listen for changes
  ../name.js
  name.js
  build
*/

var testDir = 'tests'

var gulpBrowserify = function(options, bundleOptions, commands) {
  var b
  options.extensions || (options.extensions = ['.js'])
  bundleOptions || (bundleOptions = {})
  b = browserify(options)

  for ( cmd in commands ) {
    gutil.log('Browserify running ' + cmd  + ':')
    values = commands[cmd]
    if ( typeof values === 'string' ) values = [values]
    values.forEach(function(value) {
      gutil.log('b[' + cmd + '](' + value + ')')
      b[cmd](value)
    })
  }
  return b.bundle(bundleOptions)
}

var build = function() {
  var tasks = []
  fs.readdir(testDir, function(err, files) {
    var links = []
    files.forEach(function(name) {
      if ( /\.js$/.test(name) ) {
        var src = __dirname + '/' + testDir + '/' + name
        var dst = name.replace(/\.js/,'.html')
        links.push('<a href="/'+testDir+'/'+dst+'">'+name+'</a>')
        tasks.push(
          gulpBrowserify({
            entries: src
          },{
            debug: true
          },{
            transform: ['reactify']
          })
          .on('error', function(trace) {
            console.error(trace)
            fs.writeFileSync(testDir+'/'+dst, trace)
          })
          .pipe(source())
          .pipe(buffer())
          .pipe(map(function(data, file) {
            var script = data.toString()
            return '<html><head><title>Test for '+name+'</title></head>'+
                   '<body><script>'+script+'</script></body></html>'
          }))
          .pipe(concat(dst))
          .pipe(gulp.dest(__dirname + '/' + testDir))
        )
      }
    })
    fs.writeFileSync(testDir+'/index.html', links.join('<br>'))
    return es.concat.apply(this, tasks)
  })
}

var watcher = function() {
  watch({glob: testDir+'/*.js'}, function() { build() })
  watch({glob: '*.js'}, function() { build() })
  watch({glob: 'components/*.js'}, function() { build() })
}

gulp.task('test', function() {
  watcher()
  gutil.log('Tests listening for changes')
})