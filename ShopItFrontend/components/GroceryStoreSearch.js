import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { AppLoading } from 'expo';
import { SearchBar } from 'react-native-elements';
import {useFonts, ComicNeue_400Regular } from '@expo-google-fonts/comic-neue';
const API_KEY = 'AIzaSyB0OBBZB0abirvfDAjbAWbCeGqk-knKvtw';

const GroceryStoreSearch = () => {
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});
    const [location, setLocation] = useState(null);
    const [search, setSearch] = useState(' ');
    const [stores, setStores] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);

    // if (!fontsLoaded) {
    //     return <AppLoading />;
    // }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }

            var location = await Location.getLastKnownPositionAsync({});
            setLocation(location);

            const latitude = location.coords.latitude;
            const longitude = location.coords.longitude;
    
            const placeUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&rankby=distance&keyword=grocery store&key=' + API_KEY;
    
            const stores = [];

            fetch(placeUrl)
            .then(res => {
                return res.json()
            })
            .then(res => {
                for (let googlePlace of res.results) {
                    var store = {};
    
                    var placeId = googlePlace.place_id;
                    
                    const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?place_id=' + placeId + '&key=' + API_KEY;
                    
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
                setStores(stores);
            })
            .catch(error => {
                console.log(error);
            });
        })()
    }, []);

    const renderItem = ({item}) => {
        console.log("Creating item " + item.name);
        return (
            <View style={styles.item}>
                <TouchableOpacity style={styles.button} onPress={() => console.log("button presseed")}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.descripton}>{item.address}</Text>
                </TouchableOpacity>
            </View>
        );
     };


    return (
        <View style={styles.container}>
            <TextInput 
            placeholder='Search for stores'
            onChangeText={text => setSearch(text)}
            />
            <FlatList
            data={stores}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 50,
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