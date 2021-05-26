const { src, dest, watch, parallel, series } = require('gulp'),

      scss         = require('gulp-sass'),
      concat       = require('gulp-concat'),
      browserSync  = require('browser-sync').create(),
      uglify       = require('gulp-uglify-es').default,
      autoprefixer = require('gulp-autoprefixer'),
      imagemin     = require('gulp-imagemin'),
      del          = require('del')

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}
    
function styles() {
    return src('app/scss/style.scss')
            .pipe(scss({ outputStyle: 'compressed' }))
            .pipe(concat('style.min.css'))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 10 version'],
                grid: true
            }))
            .pipe(dest('app/css'))
            .pipe(browserSync.stream())
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function clearDist() {
    return  del('dist')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js','!app/js/main.min.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

exports.styles = styles
exports.watching = watching
exports.browsercync = browsersync
exports.scripts = scripts
exports.images = images
exports.clearDist = clearDist


exports.build = series(clearDist, images, build)
exports.default = parallel(styles, scripts, browsersync, watching)