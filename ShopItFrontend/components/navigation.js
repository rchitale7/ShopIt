import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import SampleMap from '../assets/sample-map.jpg';

function Map() {
    return (
        <View>
            <Image source={SampleMap} />
        </View>
    );
}

export { Map };