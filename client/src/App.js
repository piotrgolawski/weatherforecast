import React, { Component } from 'react';
import './App.css';
import AutomaticPositionButton from './components/AutomaticPositionButton.js';
import { Meteogram } from './libs/Meteogram';
import WeatherBox from "./components/WeatherBox";
import { stringToXML, xmlToJson } from "./utils/xmlUtils";
import { getHourDateRange } from "./utils/dateTimeUtils";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
    constructor() {
        super();
        this.setCity = this.setCity.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setRange = this.setRange.bind(this);
        this.actualizeForecastData = this.actualizeForecastData.bind(this);
        this.setRefreshInterval = this.setRefreshInterval.bind(this);

        this.state = {loading: true};
        this.forecastParameters = {lat: undefined, lon: undefined, city: undefined};
        this.fetchedCity = '';

        this.refreshIntervalTime = 30;
        this.currentInterval = null;
        this.dates = {};
    }

    setCity(event) {
        this.forecastParameters.lat = undefined;
        this.forecastParameters.lon = undefined;
        this.forecastParameters.city = encodeURIComponent(event.target.value);
        this.forceUpdate();
    }

    setPosition(position) {
        this.setState({loading: true});
        this.forecastParameters.lat = position.coords.latitude;
        this.forecastParameters.lon = position.coords.longitude;
        this.forecastParameters.city = undefined;
        this.actualizeForecastData();
    }

    setRange(from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        this.refs.forecastRange.innerHTML = 'Actual forecast range: ' + getHourDateRange(fromDate, toDate);
    }

    setRefreshInterval(event) {
        let interval = event.target.value * 60 * 1000;
        if (!interval || interval === 0) {
            clearInterval(this.currentInterval);
            return;
        }

        toast.info('Refresh interval set for ' + event.target.value + ' minute/s', {
            position: "bottom-right",
            autoClose: 5000
        });

        let that = this;
        if (this.refreshIntervalTime !== interval) {
            clearInterval(this.currentInterval);
            this.refreshIntervalTime = interval;

            this.currentInterval = setInterval(function () {
                that.actualizeForecastData();
            }, this.refreshIntervalTime);
        }
    }

    handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            this.actualizeForecastData()
        }
    };

    actualizeForecastData() {
        this.setState({loading: true});
        fetch('/getForecast', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.forecastParameters)
        }).then(res => {
            if (res.ok) {
                let that = this;
                res.text().then(function (xmlAsString) {
                    toast.info('Forecast data fetched!', {
                        position: "bottom-right",
                        autoClose: 5000
                    });
                    let xml = stringToXML(xmlAsString);
                    that.dates = that.getWeatherDataByDays(xmlToJson(xml.querySelector('forecast')))

                    let cityName = xml.querySelector('location name').textContent;
                    that.refs.city.value = '';
                    that.fetchedCity = cityName;

                    new Meteogram(xml, 'meteogram');
                    that.setState({loading: false});
                }).catch(function () {
                    that.setState({loading: false});
                    toast.error('Error parsing forecast data', {
                        position: "bottom-right",
                        autoClose: 5000
                    });
                });
            }
            else {
                this.setState({loading: false});
                toast.error('Cannot fetch forecast data: ' + res.statusText, {
                    position: "bottom-right",
                    autoClose: 5000
                });
            }
        });
    }

    getWeatherDataByDays(json) {
        let dates = {};
        for (let entry of json.time.entries()) {
            let date = entry[1]['@attributes'].from.substr(0, 10);
            if (!dates[date]) {
                dates[date] = [];
            }

            dates[date].push(entry[1]);
        }

        return dates;
    }

    componentDidMount() {
        this.setState({loading: false});
    }

    render() {
        return (
            <div className="App">
                <ul className="nav">
                    <li className="white-text nav-name-text">Piotr Goławski, Weather Forecast project</li>
                    <li>
                        <span>
                            <input type="text" placeholder="City name" id="searchInput" onKeyUp={this.setCity} ref="city" onKeyDown={this.handleEnterKey}/>
                            <button className="btn" id="searchButton" disabled={!this.forecastParameters.city} type="button" onClick={this.actualizeForecastData}> Search</button>
                        </span>
                    </li>
                    <li className="nav-automatic-position-button"><AutomaticPositionButton getPositionCallback={this.setPosition}/></li>
                    {this.dates && Object.keys(this.dates).length > 0 ?
                        (<li className="white-text">Refresh interval: <input type="number" id="intervalInput" onKeyUp={this.setRefreshInterval} placeholder="Refresh interval" min="0"/> min</li>)
                        : ''}
                    <li className="last-li white-text" ref="forecastRange"/>
                </ul>

                {this.state.loading && <img id="loading" src="loader.gif" alt=""/>}

                <WeatherBox getActualForecstRange={this.setRange} dates={this.dates} city={this.fetchedCity}/>

                <div id="meteogram"/>

                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            </div>
        );
    }
}

export default App;