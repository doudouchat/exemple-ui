// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      mocha : {
				timeout : 20000
			}
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage/exemple-ui'),
      reports : [ 'html', 'text-summary', 'cobertura', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
		mochaReporter : {
			showDiff : true,
			colors : {
				success : 'green',
				info : 'grey',
				warning : 'yellow',
				error : 'red'
			}
		},
    reporters : [ 'progress', 'mocha', 'coverage-istanbul' ],
    port: 9876,
  	colors : true,
		logLevel : config.LOG_INFO,
		browserNoActivityTimeout : 20000,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    restartOnFileChange: true
  });
};
