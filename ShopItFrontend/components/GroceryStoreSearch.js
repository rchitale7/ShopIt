import React, { useState, useEffect } from 'react';
import {Text, View, Dimensions, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import * as Location from 'expo-location';

import logo_filled from '../assets/logo_filled.png'
import search_icon from '../assets/search.png'

import { Colors } from '../CommonStyles';
import { useFonts, ComicNeue_400Regular } from '@expo-google-fonts/comic-neue';
import { Fontisto } from '@expo/vector-icons';

const API_KEY='AIzaSyB0OBBZB0abirvfDAjbAWbCeGqk-knKvtw';

import { NavigationContainer } from '@react-navigation/native';

import { 
    retrieveStoreData, 
    getGroceryStoreData,
    useGlobalDispatch
  } from './GlobalItemStore';

const GroceryStoreSearch = ({ navigation }) => {
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [search, setSearch] = useState('');
    const [stores, setStores] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);

    const dispatch = useGlobalDispatch();

    useEffect(() => {
        getLocation();
    }, []);

    async function getLocation() {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        var location = await Location.getLastKnownPositionAsync({});

        const latitude = location.coords.latitude;
        setLatitude(latitude);
        const longitude = location.coords.longitude;
        setLongitude(longitude);
    }

    useEffect(() => {
        const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&keyword=grocery store&key=${API_KEY}`;
    
        const stores = [];

        fetch(placeUrl)
        .then(res => {
            return res.json()
        })
        .then(res => {
            for (let googlePlace of res.results) {
                var store = {};

                var placeId = googlePlace.place_id;
                
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${API_KEY}`;
                
                store.name = googlePlace.name;
                store.url = geocodeUrl;

                stores.push(store);
            }
        })
        .then(res => {
            return Promise.all(stores.map((store, i) => 
                fetch(store.url)
                .then(res => res.json()
                .then(res => {
                    var address = res.results[0].formatted_address;
                    store.address = address;
                }))))
        })
        .then(res => {
            // set top 10 stores
            setStores(stores.slice(0,10));
            setSearch("");
        })
        .catch(error => {
            console.log(error);
        });
    }, [longitude]);

    function updateLocation(location) {
        var placeId = location.place_id;

        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;

        fetch(detailsUrl)
        .then(res => {
            return res.json();
        })
        .then(res => {
            var location = res.result.geometry.location;

            const latitude = location.lat;
            setLatitude(latitude);
            const longitude = location.lng;
            setLongitude(longitude); 
        })      
    }

    function onChangeDestination(search) {
        setSearch(search);

        const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&location=${latitude},${longitude}&radius=50&key=${API_KEY}`;
    
        fetch(autocompleteUrl)
        .then(res => {
            return res.json()
        })
        .then(res => {
            var predictions = res.predictions;
            setPredictions(predictions);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function renderSuggestion(item) {
        if (search != "") {
            return (
                <View>
                    <TouchableHighlight styles={styles.highlight} 
                    onPress={() => updateLocation(item.item)}>
                        <Text style={styles.suggestions}>{item.item.description}</Text>
                    </TouchableHighlight>
                </View>
            )
        }
    }

    const locationPressed = async (item) => {
        try {
            await retrieveStoreData(item);

            dispatch({
                type: 'addStoreData',
                payload: getGroceryStoreData()
            });

            navigation.navigate('Search');
        }      
        catch (err) {
            console.log(err);
        }
    }

    const renderButton = ({item}) => {
        return (
            <View>
                <TouchableOpacity style={styles.button} 
                activeOpacity={0.7}
                onPress={async () => await locationPressed(item) }>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.description}>{item.address}</Text>
                </TouchableOpacity>
            </View>
        );
     };

    if (!fontsLoaded) {
        return <Text></Text>;
    } else {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={logo_filled}/>
                <View style={styles.searchSection}>
                    <TextInput style={styles.input}
                    placeholder="Search"
                    onChangeText={search => onChangeDestination(search)}
                    value={search}
                    />
                    <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => getLocation()}>
                        <Fontisto style={styles.locationIcon} name="map-marker-alt" color='dimgrey' size={30} />
                        {/* <Image style={styles.locationIcon} source={location_icon}></Image> */}
                    </TouchableOpacity>
                    <Image style={styles.searchIcon} source={search_icon}/>
                </View>
                <View style={{flex:1}}>
                    <FlatList
                    data={stores}
                    renderItem={renderButton}
                    keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.suggestionsList}>
                    <FlatList
                    data={predictions}
                    renderItem={item => renderSuggestion(item)}
                    keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: Colors.green,
      justifyContent: 'flex-start',
      paddingTop: 50,
    },
    logo: {
        alignSelf: 'center',
    },
    searchSection: {
        marginBottom: 10,
    },
    locationIcon: {
        flex: 1,
        position: 'absolute',
        height: 32,
        width: 32,
        top: -51,
        left: 329,
    },
    searchIcon: {
        position: 'absolute',
        top: 10,
        left: 20,
    },
    suggestionsList: {
        position: 'absolute',
        top: 225,
        width: 390,
        marginTop: 10,
        marginLeft: 12,
        borderRadius: 19,
        overflow: 'hidden',
        backgroundColor: '#FFF',
    },
    suggestions: {
        marginLeft: 10,
        padding: 7,
        fontSize: 18,
        backgroundColor: '#FFF',
        fontFamily:"ComicNeue_400Regular"
    },
    input: {
        height: 50,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 50,
        borderRadius: 19,
        fontSize: 24,
        backgroundColor: Colors.beige,
        fontFamily:"ComicNeue_400Regular"
    },
    highlight: {
        marginLeft: 10,
        marginRight: 10,
    },
    button: {
        alignItems: "flex-start",
        backgroundColor: Colors.beige,
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 10,
        padding: 20,
        borderRadius: 19,
        borderColor: Colors.beige
    },
    title: {
        fontSize: 32,
        fontFamily:"ComicNeue_400Regular"
    },
    description: {
        fontSize: 15,
        fontFamily:"ComicNeue_400Regular"
    },
});

export default GroceryStoreSearch;