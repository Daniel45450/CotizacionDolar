const {src, dest, watch, parallel} = require('gulp');

//css
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');

//js
const terser = require('gulp-terser-js');

const rutas = {
    css: 'src/css/**/*',
    js: 'src/js/**/*',
    img: 'src/img/**/*'
}

function imagenes() {
    return src(rutas.img)
        .pipe(dest('./build/img'));
}

function css() {
    return src(rutas.css)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'));
}

function watchArchivos() {
    watch(rutas.css, css);
    watch(rutas.js, javascript)
}

function javascript() {
    return src(rutas.js)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/js'));
}

exports.default = parallel(css, javascript, imagenes, watchArchivos);

