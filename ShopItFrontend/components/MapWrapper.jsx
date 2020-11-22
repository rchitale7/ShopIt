import { StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';
/*
This is a helper wrapper component to display the green "Map" frame.

Note: -We will need our children component to have flex:1 
      -The View tag here is the root of all view tags.
*/
const MapWrapper = ({children}) => {
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});

    if(!fontsLoaded){
        return <Text> Fonts haven't loaded just yet!</Text>;
    }else{
        return (
            <View style={styles.map}>  
            
                <Text style={styles.mapHeader}>Map</Text>
                {children}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    map: {
        backgroundColor:'#91E78C',
        flex:1,
        padding:15,
        paddingBottom:100,
        paddingTop:80
    },
    mapHeader: {
        fontFamily:"ComicNeue_400Regular",
        lineHeight:41.4,
        fontSize:36,
        textAlign:"center",
        position: "absolute",
        top:30,
        left:150
    }
});

export default MapWrapper;