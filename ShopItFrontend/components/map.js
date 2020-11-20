import React from 'react';

import { View, Text, Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

import SampleMap from '../assets/sample-map.png';

function Map() {
    return (
        <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={400}
                       imageHeight={600}>
            <Image source={SampleMap} style={{width: 400, height: 600}} />
        </ImageZoom>
    );
}

export default Map;