## About
My name is Piotr Goławski and this project is made because of skill presentation purposes.

Website communicates with openweathermap api and fetches available weather data for next five days, including today.

Actual website: [weather forecast](https://pg-weather-forecast.herokuapp.com/)

### Usage
The first page is empty, you have to type city in the navbar and click search or click "Get forecast by my position" (and allow to do that) to fetch forecast automatically. 
If data have been found, you can use arrows which are placed on both sides of weather forecast container in the center of the screen. Arrows allow switching currently checked day, only five days data is fetched and allowed.
On the bottom of the screen, you can see a chart where all five days data is presented. 
If you would like to refresh data in the interval you have to fill refresh interval input in navbar.

### How to run locally
All commands should be run in the main project folder.

 - npm install - it will install dependencies in backend and frontend application
 
 - npm start - it will run both server and client
 
### How to run tests
 - './client/node_modules/protractor/bin/webdriver-manager update' - updates webdriver
 - './client/node_modules/protractor/bin/webdriver-manager start' - runs webdriver (you need to run this in new terminal tab, it must be turned on during tests)
 - npm test - runs E2E tests (chrome 65 or newer is a requirement)
 
 The browser window will open and test start, test state should be written in the terminal.
 
### Frameworks and libraries
- NodeJs - I have chosen node for the backend, because of its lightweight, language, ease of use and deploy
- ExpressJS - This choice is connected with previous, expressjs deal with a lot of boilerplate code
- React - I needed something which helps me with data binding on the frontend, I chose react not angular because react is lighter and I know it less, so this is a good occasion to learn
- Protractor - a tool for E2E tests, I used it now because I used it few times before and it works well
- concurrently - allows running server and client in the same time
- body-parser - helps with json parsing in rest requests
- ejs - a simple and lightweight html template solution for node
- Highcharts - one of the best charts library, used for the chart of the bottom of page
- jasmine-spec-reporter - It allows to show test progress in the console during tests

I am aware that it is possible to do this task using only plain javascirpt and even only one single file, but that is not good practice and it will block the theoretical development of the project.

### What is missing, what I could have done better 
- SCSS/similar - I choose to not use a dynamic preprocessor style sheet language because I really cannot use its features in so small project, but if the project grows, it will be a good idea, 
however there is no problem to change it in the future
- better styling - I am not a CSS master, not all styles have consistent name and destiny
- better responsivity, not all resolutions are fully covered with css, nor all elements are
- same functionalities and styles in other browsers may not work properly, now product work well and are tested only in chrome and firefox browser
- I decided to ask API only once, because of highchart it was easier to request xml and then parse to json the part I need for the center of the screen, I think this is better way than request for 
data twice
- move big html code from WeatherBox component to separate file or files, now is not readable
- make more helper functions which will improve readability of code focused on accessing parsed json objects
- change Meteogram highchart from lib to component 
- screen before fetching data is empty, it should not be
