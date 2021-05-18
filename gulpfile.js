
let project_folder = require("path").basename(__dirname); //rename destination dir to project name
let source_folder = "src";

let fs = require('fs');


// DIRECTORIES path
let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    libs: project_folder + "/libs/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: source_folder + "/*.html",
    css: source_folder + "/scss/main.scss",
    js: source_folder + "/js/main.js",
    libs: source_folder + "/libs/**/*.*",
    app: source_folder + "/js/app.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,webp,ico}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    libs: source_folder + "/libs/**/*.*",
    img: source_folder + "/img/**/*.{jpg,png,svg,webp,ico}",
  },
  clean: "./" + project_folder + "/"
}


// BUILD TOOLS STACK init
const {
  src,
  dest
} = require('gulp');
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const svgSprite = require("gulp-svg-sprite");
const fonter = require("gulp-fonter");


// plugin BROWSERSYNC config
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
};

// HTML --------------------------
function html() {
  return src(path.src.html)
    .pipe(fileinclude({
      prefix: '@@' 
    }))
    // .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};


// CSS ---------------------------
function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
    // group media-queries and input to end css file
    .pipe(
      group_media()
    )
    // autoprefix
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    // css minify
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
};

// JS ----------------------------
function js() {
  return src(path.src.js)
    // .pipe(fileinclude())
    .pipe(dest(path.build.js))
    //js minify
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

// LIBS --------------------------
function libs() {
  return src(path.src.libs)
    .pipe(dest(path.build.libs))
    .pipe(browsersync.stream())
};
// APP ---------------------------
function app() {
  return src(path.src.app)
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

// IMG ---------------------------
function images() {
  return src(path.src.img)
    // convert to .webp
    // .pipe(
    //   webp({
    //     quality: 70
    //   })
    // )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    // image optimize
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
};


// TASK fonts OTF to TTF: terminal cmd - gulp otf2ttf
gulp.task('otf2ttf', function() {
  return gulp.src([source_folder + '/fonts/*.otf'])
  .pipe(fonter({
    formats: ['ttf']
  }))
  .pipe(dest(source_folder + '/fonts/'))
})

// TASK svg icons to sprite: terminal cmd - gulp svgSprite
gulp.task('svgSprite', function() {
  return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../icons/icons.svg", //sprite file name
          //example: true
        }
      },
    }))
    .pipe(dest(path.build.img))
})

// FONTS --------------------------
function fonts() {
  src(path.src.fonts)
    // convert to .woff
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    // convert to .woff2
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
};

// INSTALL FONTS in CSS {
function fontsStyle(params) {

  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
}

function cb() {}
// INSTALL FONTS in CSS }


// TRACKING FILES
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.libs], libs);
  gulp.watch([path.watch.img], images);
}

// CLEAN destination directory
function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, libs, app), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.app = app;
exports.libs = libs;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;