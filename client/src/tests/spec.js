describe('Weather Forecast Flow', function () {

    let mainUrl, today, tomorrow;

    beforeAll(function () {
        browser.ignoreSynchronization = true;
        let todayDate = new Date();
        today = new Date().toISOString().substring(0, 10);
        tomorrow = new Date(todayDate.setDate(todayDate.getDate() + 1)).toISOString().substring(0, 10);
    });

    it('Reach page', () => {
        browser.get('/');
        mainUrl = browser.getCurrentUrl();

        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toBe(mainUrl);
    });

    it('Can fetch forecast data by typing city', () => {
        loadForecastManually();

        browser.sleep(1000);
        expect($('#meteogram').isDisplayed()).toBeTruthy();
        expect($('.weather-box').isDisplayed()).toBeTruthy();
    });

    it('Can fetch forecast data automatically', () => {
        browser.get('/');
        $('.nav-automatic-position-button').click();

        browser.sleep(1000);
        expect($('#meteogram').isDisplayed()).toBeTruthy();
        expect($('.weather-box').isDisplayed()).toBeTruthy();
    });

    it('Proper city is loaded', () => {
        browser.get('/');
        loadForecastManually();

        browser.sleep(1000);
        expect($('#loadedCity').isDisplayed()).toBeTruthy();
        expect($('#loadedCity').getText()).toEqual(browser.params.city);
    });

    it('Proper day is loaded', () => {
        browser.sleep(1000);
        expect($('#loadedCity').isDisplayed()).toBeTruthy();
        expect($('#currentDate').getText()).toEqual(today);
    });

    it('Cannot switch day to previous', () => {
        $('#left-arrow').click();
        browser.sleep(1000);

        expect($('#left-arrow').getAttribute('class')).toMatch('blocked-arrow');
        expect($('#loadedCity').isDisplayed()).toBeTruthy();
        expect($('#currentDate').getText()).toEqual(today);
    });

    it('Can switch day to next', () => {
        $('#right-arrow').click();
        browser.sleep(1000);

        expect($('#loadedCity').isDisplayed()).toBeTruthy();
        expect($('#currentDate').getText()).toEqual(tomorrow);
    });

    it('Can switch day to previous', () => {
        $('#left-arrow').click();
        browser.sleep(1000);

        expect($('#loadedCity').isDisplayed()).toBeTruthy();
        expect($('#currentDate').getText()).toEqual(today);
    });

    it('Interval works', () => {
        $('#right-arrow').click();
        $('#intervalInput').sendKeys('0.1')
        browser.sleep(1000);

        expect($('#currentDate').getText()).toEqual(tomorrow);
    });

    function loadForecastManually() {
        $('#searchInput').sendKeys(browser.params.city);
        $('#searchButton').click();
    }
});