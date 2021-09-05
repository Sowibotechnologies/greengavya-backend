import React from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';

const GOOGLE_MAPS_JS_API_KEY='AIzaSyBpHElMqXs6JLaWsYkqJmMsyYz-IveR84E';


class MapContainer extends React.Component {
    state = {
        zoom: 13
    }

onMapClicked (props) {
    if (this.state.showingInfoWindow) {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null
        })
    }
}

handleMapMount(mapProps, map) {
    this.map = map;

    //log map bounds
    console.log(this.map.getBounds());
}

render() {
    const {google} = this.props;

    if (!this.props.loaded) {
        return <div>Loading...</div>
    }

    return (
        <Map className='google-map'
            google={google}
            onClick={this.onMapClicked.bind(this)}
            zoom={this.state.zoom}
            onReady={this.handleMapMount.bind(this)}
            styles={
                [{
                    stylers: [{
                      saturation: -100
                    }]
                }]
            }
            initialCenter={{
                lat: 8.507035,
                lng: 76.964408
               }} 
            >
        </Map>
        );
    }
}

export default GoogleApiWrapper({
apiKey: (GOOGLE_MAPS_JS_API_KEY)
})(MapContainer);