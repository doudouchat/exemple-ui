// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: [
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-coverage')
    ],
    client: {
      mocha: {
        timeout: 20000
      }
    },
    coverageReporter: {
      dir: '../coverage/exemple-ui',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'html', subdir: '.' },
        { type: 'text-summary', subdir: '.' }
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
