import React, {Component} from 'react';
import {connect} from 'react-redux';
import Chart from '../components/chart';
import GoogleMaps from '../components/googleMaps';

class WeatherList extends Component {

    renderWeather(cityData) {
        const name = cityData.city.name;
        const temps = cityData.list.map(weather => weather.main.temp);
        const humidities = cityData.list.map(weather => weather.main.humidity);
        const pressures = cityData.list.map(weather => weather.main.pressure);
        const {lon, lat} = cityData.city.coord;

        return (
          <tr key={name}>
              <td><GoogleMaps lon={lon} lat={lat} /></td>
              <td>
                  <Chart data={temps} color="orange" />
              </td>
              <td>
                  <Chart data={pressures} color="green" />
              </td>
              <td>
                  <Chart data={humidities} color="blue" />
              </td>
          </tr>
        );
    }

    render() {
        return (
            <table className="table table-hover">
                <thead>
                  <tr>
                      <th>City</th>
                      <th>Temperature</th>
                      <th>Pressure</th>
                      <th>Humidity</th>
                  </tr>
                </thead>
                <tbody>
                    {this.props.weather.map(this.renderWeather)}
                </tbody>
            </table>
        );
    }
}

function mapStateToProps({weather}) {
    return {weather};
}

export default connect(mapStateToProps)(WeatherList);