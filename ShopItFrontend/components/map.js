import React from 'react';
import { View, Text, Image } from 'react-native';
import SampleMap from '../assets/sample-map.png';

function Map() {
    return (
        <View>
            <Image source={SampleMap} style={{width: 350, height: 600}}></Image>
        </View>
    );
}

export default Map;