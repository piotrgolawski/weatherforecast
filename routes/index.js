const express = require('express');
const https = require('https');
const router = express.Router();
const config = require('../config.json');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Weather forecast'});
});

router.post('/getForecast', function (req, res) {
    showPosition(req.body.lat, req.body.lon, req.body.city).then(function (result) {
        res.set('Content-Type', 'application/xml');
        res.send(result);
    }).catch(function (statusCode, errorMessage) {
        res.status(statusCode).send(errorMessage)
    });

});

function showPosition(lat, lon, city) {
    return new Promise((resolve, reject) => {
        const url = city ? getUrlByCity(city) : getUrlByLocalization(lat, lon);

        https.get(url, res => {
            res.setEncoding("utf8");

            if(res.statusCode !== 200) {
                reject(res.statusCode, res.errorCode);
            }

            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                resolve((body));
            });
        }).on("error", (error) => {
            reject(500, error)
        });
    });
}

function getUrlByCity(city) {
    return config.forecastUrl + "?q=" + city + "&APPID=68f7ab6f72a3018d06fef63b982e64cf&cnt=60"+ '&mode=xml&units=metric';
}

function getUrlByLocalization(lat, lon) {
    return  config.forecastUrl + "?APPID=" + config.APPID + "&cnt=60&lat=" + lat + "&lon=" + lon + '&mode=xml&units=metric';
}

module.exports = router;
