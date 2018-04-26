exports.config = {
    specs: ['./src/tests/*.js'],
    capabilities: {
        browserName: 'chrome',
        'chromeOptions': {
            args: [
                '--window-size=1800,1200'
            ]
        }
    },
    baseUrl: 'http://localhost:3000',
    framework: 'jasmine',
    params: {
        city: "Gdansk"
    },
    onPrepare: function () {
        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
    },
};