import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getProperWindArrowElement, getWeatherSymbolImage } from "../utils/weatherSymbolsUtils";

class WeatherBox extends Component {
    constructor(props) {
        super(props);
        this.isFirst = this.isFirst.bind(this);
        this.prevDate = this.prevDate.bind(this);
        this.isLast = this.isLast.bind(this);
        this.nextDate = this.nextDate.bind(this);
        this.state = {dates: {}};
        this.noDataMark = ' - ';
        this.city = '';
    }

    componentWillReceiveProps(nextProps) {
        this.setState({dates: nextProps.dates, currentDate: Object.keys(nextProps.dates)[0]});
        this.city = nextProps.city;
    }

    isFirst() {
        const keys = Object.keys(this.state.dates);
        const currentKeyPosition = keys.indexOf(this.state.currentDate);
        return !keys[currentKeyPosition - 1];
    }

    prevDate() {
        if (!this.isFirst()) {
            const keys = Object.keys(this.state.dates)
            this.setState({currentDate: keys[keys.indexOf(this.state.currentDate) - 1]})
        }

        return false;
    }

    isLast() {
        const keys = Object.keys(this.state.dates);
        const currentKeyPosition = keys.indexOf(this.state.currentDate);
        return !keys[currentKeyPosition + 1];
    }

    nextDate() {
        if (!this.isLast()) {
            let keys = Object.keys(this.state.dates)
            this.setState({currentDate: keys[keys.indexOf(this.state.currentDate) + 1]})
        }

        return false;
    }

    getActualWeatherForecast(dates) {
        const currentWeatherArray = dates[this.state.currentDate];

        const now = new Date().getTime();
        let fromTimeTimestamps = {};

        for (let todayWeatherKey in currentWeatherArray) {
            const fromDay = new Date(currentWeatherArray[todayWeatherKey]['@attributes'].from);

            const fromTime = fromDay.getTime();
            const toTime = new Date(currentWeatherArray[todayWeatherKey]['@attributes'].to).getTime();

            // if it not today, I need records from middle of a day
            if (new Date().getUTCDate() !== fromDay.getUTCDate()) {
                const middleKey = parseFloat((Object.keys(currentWeatherArray).length - 1) / 2).toFixed(0);
                return currentWeatherArray[middleKey];
            }

            fromTimeTimestamps[fromTime] = todayWeatherKey;

            // if we have record containing actual hour, get that record
            if (fromTime < now && now < toTime) {
                return currentWeatherArray[todayWeatherKey];
            }
        }

        // if we have not data about actual hour, find the closest one
        if (Object.keys(fromTimeTimestamps).length > 0) {
            const closestEndTimeToActualTime = Object.keys(fromTimeTimestamps).reduce(function (prev, curr) {
                return (Math.abs(curr - now) < Math.abs(prev - now) ? curr : prev);
            });

            return currentWeatherArray[fromTimeTimestamps[closestEndTimeToActualTime]];
        }

        // if we really cannot find data, get data we have
        return currentWeatherArray[Object.keys(currentWeatherArray)[0]];
    }

    render() {
        const dates = this.state.dates;
        if (dates && Object.keys(dates).length > 0 && this.city) {
            let actualWeather = this.getActualWeatherForecast(dates);
            let actualNightWeather = dates[this.state.currentDate][Object.keys(dates[this.state.currentDate]).length - 1];
            this.props.getActualForecstRange(actualWeather['@attributes'].from, actualWeather['@attributes'].to);

            return (
                <div className="weather-box flex">
                    <div className="weather-box-col weather-box-col-today">
                        <span className="weather-box-title"><span id="loadedCity">{this.city}</span>, <span id="currentDate">{this.state.currentDate}</span></span>
                        <div className="weather-box-info">
                            <figure className="weather-box-ico">
                                <img src={getWeatherSymbolImage(actualWeather.symbol['@attributes'].var)} className="weather-box-ico-img" alt=""/>
                            </figure>
                            <div className="weather-box-details">
                                <div className="weather-box-temp">
                                    <span className="json-temperature">{actualWeather.temperature['@attributes'] && actualWeather.temperature['@attributes'].value ? (
                                        <span>{parseFloat(actualWeather.temperature['@attributes'].value).toFixed(0)} <sup>°C</sup></span>) : this.noDataMark}</span>
                                </div>
                                <div className="weather-box-cond">
                                    {actualWeather.precipitation['@attributes'] && actualWeather.precipitation['@attributes'].type ? actualWeather.precipitation['@attributes'].type : ''}
                                    {actualWeather.precipitation['@attributes'] && actualWeather.precipitation['@attributes'].type && actualWeather.clouds['@attributes'] && actualWeather.clouds['@attributes'].value ? ', ' : ''}
                                    {actualWeather.clouds['@attributes'] && actualWeather.clouds['@attributes'].value ? actualWeather.clouds['@attributes'].value : ''}
                                </div>
                            </div>
                        </div>
                        <ul className="weather-box-items">
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Wind</span>
                                <span
                                    className="weather-box-item-value">{actualWeather.windSpeed['@attributes'] && actualWeather.windSpeed['@attributes'].mps ? (
                                    <span>{parseFloat(actualWeather.windSpeed['@attributes'].mps * 3.6)
                                        .toFixed(2)} km/h {getProperWindArrowElement(actualWeather.windDirection['@attributes'].deg)}</span>) : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Clouds</span>
                                <span
                                    className="weather-box-item-value">{actualWeather.clouds['@attributes'] && actualWeather.clouds['@attributes'].all ? actualWeather.clouds['@attributes'].all + '% sky' : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Rain</span>
                                <span
                                    className="weather-box-item-value">{actualWeather.precipitation['@attributes'] && actualWeather.precipitation['@attributes'].value && actualWeather.precipitation['@attributes'].unit ? parseFloat(actualWeather.precipitation['@attributes'].value)
                                    .toFixed(4) + ' mm / ' + actualWeather.precipitation['@attributes'].unit : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Pressure</span>
                                <span
                                    className="weather-box-item-value">{actualWeather.pressure['@attributes'] && actualWeather.pressure['@attributes'].value && actualWeather.pressure['@attributes'].unit ? actualWeather.pressure['@attributes'].value + ' ' + actualWeather.pressure['@attributes'].unit : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Humidity</span>
                                <span
                                    className="weather-box-item-value">{actualWeather.humidity['@attributes'] && actualWeather.humidity['@attributes'].value && actualWeather.humidity['@attributes'].unit ? actualWeather.humidity['@attributes'].value + ' ' + actualWeather.humidity['@attributes'].unit : this.noDataMark}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="weather-box-col weather-box-col-night">
                        <span className="weather-box-title">Night</span>
                        <div className="weather-box-info">
                            <figure className="weather-box-ico">
                                <img src={getWeatherSymbolImage(actualNightWeather.symbol['@attributes'].var)} alt="" className="weather-box-ico-img"/>
                            </figure>
                            <div className="weather-box-details">
                                <div className="weather-box-temp">
                                    {actualNightWeather.temperature['@attributes'] && actualNightWeather.temperature['@attributes'].value ? (
                                        <span>{parseFloat(actualNightWeather.temperature['@attributes'].value).toFixed(0)} <sup>°C</sup></span>) : this.noDataMark}
                                </div>
                                <div className="weather-box-cond">
                                    {actualNightWeather.precipitation['@attributes'] && actualNightWeather.precipitation['@attributes'].type ? actualNightWeather.precipitation['@attributes'].type : ''}
                                    {actualNightWeather.precipitation['@attributes'] && actualNightWeather.precipitation['@attributes'].type && actualNightWeather.clouds['@attributes'] && actualNightWeather.clouds['@attributes'].value ? ', ' : ''}
                                    {actualNightWeather.clouds['@attributes'] && actualNightWeather.clouds['@attributes'].value ? actualNightWeather.clouds['@attributes'].value : ''}
                                </div>
                            </div>
                        </div>
                        <ul className="weather-box-items">
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Wind</span>

                                <span
                                    className="weather-box-item-value">{actualNightWeather.windSpeed['@attributes'] && actualNightWeather.windSpeed['@attributes'].mps ? (
                                    <span>{parseFloat(actualNightWeather.windSpeed['@attributes'].mps * 3.6)
                                        .toFixed(2)} km/h {getProperWindArrowElement(actualNightWeather.windDirection['@attributes'].deg, true)}</span>) : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Clouds</span>
                                <span
                                    className="weather-box-item-value">{actualNightWeather.clouds['@attributes'] && actualNightWeather.clouds['@attributes'].all ? actualNightWeather.clouds['@attributes'].all + '% sky' : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Rain</span>
                                <span
                                    className="weather-box-item-value">{actualNightWeather.precipitation['@attributes'] && actualNightWeather.precipitation['@attributes'].value && actualNightWeather.precipitation['@attributes'].unit ? parseFloat(actualNightWeather.precipitation['@attributes'].value)
                                    .toFixed(4) + 'mm / ' + actualNightWeather.precipitation['@attributes'].unit : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Pressure</span>
                                <span
                                    className="weather-box-item-value">{actualNightWeather.pressure['@attributes'] && actualNightWeather.pressure['@attributes'].value && actualNightWeather.pressure['@attributes'].unit ? actualNightWeather.pressure['@attributes'].value + ' ' + actualNightWeather.pressure['@attributes'].unit : this.noDataMark}</span>
                            </li>
                            <li className="weather-box-item">
                                <span className="weather-box-item-label">Humidity</span>
                                <span
                                    className="weather-box-item-value">{actualNightWeather.humidity['@attributes'] && actualNightWeather.humidity['@attributes'].value && actualNightWeather.humidity['@attributes'].unit ? actualNightWeather.humidity['@attributes'].value + ' ' + actualNightWeather.humidity['@attributes'].unit : this.noDataMark}</span>
                            </li>
                        </ul>
                    </div>
                    <div id="left-arrow" className={'arrow ' + (this.isFirst() ? 'blocked-arrow' : '')} onClick={this.prevDate}/>
                    <div id="right-arrow" className={'arrow ' + (this.isLast() ? 'blocked-arrow' : '')} onClick={this.nextDate}/>
                </div>
            );
        }
        return (
            <div className="no-data-text">Type city or choose to load it automatically to get forecast</div>
        )
    }
}

ReactDOM.render(
    <WeatherBox/>,
    document.getElementById('root')
);
export default WeatherBox;
