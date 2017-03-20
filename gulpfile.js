const gulp = require('gulp')
const plug = require('gulp-load-plugins')()
const BrowserSync = require('browser-sync').create()
const RunSequence = require('run-sequence')
const rimraf = require('rimraf')

gulp.task('live:start', () => {
    RunSequence(
        'build:all',
        'live:watch',
        'live:launch-server'
    )
})

gulp.task('live:watch', (done) => {
    gulp.watch('src/html/**/*.ejs', ['build:html'])
    gulp.watch('src/css/**/*.scss', ['build:css'])
    gulp.watch('src/image/**/*', ['build:image'])
    gulp.watch('docs/**/*.html', ['live:reload-page'])
    gulp.watch('docs/image/**/*', ['live:reload-page'])
    done()
})

gulp.task('live:launch-server', (done) => {
    BrowserSync.init({
        server: { baseDir: './docs' },
        open: false,
    })
    done()
})

gulp.task('live:reload-page', () => {
    BrowserSync.reload()
})

gulp.task('build:all', (done) => {
    RunSequence(['build:html', 'build:css', 'build:image', 'build:misc'], done)
})

gulp.task('build:html', () => {
    return gulp.src('src/html/**/*.ejs')
        .pipe(plug.plumber())
        .pipe(plug.filter(['**', '!src/html/**/_*.ejs']))
        .pipe(plug.ejs(null, null, { ext: '.html' }))
        .pipe(gulp.dest('docs/'))
})

gulp.task('build:css', () => {
    return gulp.src('src/css/**/*.scss')
        .pipe(plug.plumber())
        .pipe(plug.sass())
        .pipe(gulp.dest('docs/css'))
        .pipe(BrowserSync.stream())
})

gulp.task('build:image', () => {
    return gulp.src('src/image/**/*')
        .pipe(gulp.dest('docs/image'))
})

gulp.task('build:misc', () => {
    return gulp.src('src/misc/**/*')
        .pipe(gulp.dest('docs'))
})

gulp.task('clean:all', (done) => {
    rimraf('docs', () => { done() })
})
