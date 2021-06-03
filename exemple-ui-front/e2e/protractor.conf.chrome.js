let protractorConf = require("./protractor.conf.js");

const customConfig = {
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--start-maximized']
    }
  }
}

exports.config = {...protractorConf.config, ...customConfig };