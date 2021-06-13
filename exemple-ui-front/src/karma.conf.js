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
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      mocha: {
        timeout: 20000
      }
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/testangular'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    mochaReporter: {
      showDiff: true,
      colors: {
        success: 'green',
        info: 'grey',
        warning: 'yellow',
        error: 'red'
      }
    },
    reporters: ['progress', 'mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browserNoActivityTimeout: 20000,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    restartOnFileChange: true
  });
};
