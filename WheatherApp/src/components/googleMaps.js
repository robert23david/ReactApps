import React, {Component} from 'react';



class GoogleMaps extends Component {

    constructor(props) {
        super(props);
        this.state = { term: '' };
        this.myMap = null;
    }

    componentDidMount() {
        new google.maps.Map(this.myMap, {
            zoom: 12,
            center: {
                lat: this.props.lat,
                lng: this.props.lon
            }
        });
    }
    render() {
        return (
            <div ref={(el) => this.myMap = el}/>
        );
    }
}

export default GoogleMaps;