let fileswatch = 'html,htm,txt,json,md,woff2';

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync 									= require('browser-sync').create();
const sass 												= require('gulp-sass')(require('sass'));
const cleancss											= require('gulp-clean-css');
const autoprefixer									= require('gulp-autoprefixer');
const rename											= require('gulp-rename');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	});
}

function styles() {
	return src(['app/scss/*.*', '!app/scss/_*.*'])
		.pipe(eval('sass')())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream());
}

function startwatch() {
	watch(`app/scss/**/*`, { usePolling: true }, styles);
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload);
}

exports.build = styles;
exports.default = series(styles, parallel(browsersync, startwatch));