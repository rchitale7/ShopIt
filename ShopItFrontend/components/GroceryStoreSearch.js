import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AppLoading } from 'expo';
import { SearchBar } from 'react-native-elements';
import {useFonts, ComicNeue_400Regular } from '@expo-google-fonts/comic-neue';
import logo_filled from '../assets/logo_filled.png'

const API_KEY='AIzaSyB0OBBZB0abirvfDAjbAWbCeGqk-knKvtw';

const GroceryStoreSearch = () => {
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [search, setSearch] = useState('');
    const [stores, setStores] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    async function getLocation() {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        var location = await Location.getLastKnownPositionAsync({});
        // setLocation(location);

        const latitude = location.coords.latitude;
        setLatitude(latitude);
        const longitude = location.coords.longitude;
        setLongitude(longitude);
    }

    function locateStores() {
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
            console.log(stores)
            // set top 10 stores
            setStores(stores.slice(0,9));
        })
        .catch(error => {
            console.log(error);
        });
    }

    // useEffect(() => {
    //     (async () => {
    //         let { status } = await Location.requestPermissionsAsync();
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //         }

    //         var location = await Location.getLastKnownPositionAsync({});
    //         // setLocation(location);

    //         const latitude = location.coords.latitude;
    //         setLatitude(latitude);
    //         const longitude = location.coords.longitude;
    //         setLongitude(longitude);

    //         const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&keyword=grocery store&key=${API_KEY}`;
    
    //         const stores = [];

    //         fetch(placeUrl)
    //         .then(res => {
    //             return res.json()
    //         })
    //         .then(res => {
    //             for (let googlePlace of res.results) {
    //                 var store = {};

    //                 var placeId = googlePlace.place_id;
                    
    //                 const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${API_KEY}`;
                    
    //                 store.name = googlePlace.name;
    //                 store.url = geocodeUrl;

    //                 stores.push(store);
    //             }
    //         })
    //         .then(res => {
    //             return Promise.all(stores.map((store, i) => 
    //                 fetch(store.url)
    //                 .then(res => res.json()
    //                 .then(res => {
    //                     var address = res.results[0].formatted_address;
    //                     store.address = address;
    //                 }))))
    //         })
    //         .then(res => {
    //             console.log(stores)
    //             // set top 10 stores
    //             setStores(stores.slice(0,9));
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    //     })()
    // }, []);

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
        return (
            <TouchableHighlight styles={styles.highlight} 
            onPress={() => console.log("suggestion pressed")}>
                <Text style={styles.suggestions}>{item.item.description}</Text>
            </TouchableHighlight>
        )
    }

    const renderButton = ({item}) => {
        return (
            <View style={styles.item}>
                <TouchableOpacity style={styles.button} onPress={() => console.log("button pressed")}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.descripton}>{item.address}</Text>
                </TouchableOpacity>
            </View>
        );
     };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={logo_filled}/>
            <TextInput style={styles.input}
            placeholder="Search"
            onChangeText={search => onChangeDestination(search)}
            value={search}
            />
            <FlatList
            data={predictions}
            renderItem={item => renderSuggestion(item)}
            keyExtractor={(item, index) => index.toString()}
            />
            <FlatList style={styles.list}
            data={stores}
            renderItem={renderButton}
            keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#91E78C',
      justifyContent: 'flex-start',
      paddingTop: 50,
    },
    image: {
        alignSelf: 'center',
    },
    suggestions: {
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        fontSize: 18,
        backgroundColor: '#fff',
        fontFamily:"ComicNeue_400Regular"
    },
    input: {
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        fontSize: 24,
        backgroundColor: '#fff',
        fontFamily:"ComicNeue_400Regular"
    },
    highlight: {
        marginLeft: 10,
        marginRight: 10,
    },
    list: {
        paddingTop: 75,
    },
    button: {
        alignItems: "flex-start",
        backgroundColor: "#FFFEE3",
        padding: 10
    },
    item: {
        backgroundColor: '#FFFEE3',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontFamily:"ComicNeue_400Regular"
    },
    description: {
        fontSize: 24,
        fontFamily:"ComicNeue_400Regular"
    },
});


export default GroceryStoreSearch;