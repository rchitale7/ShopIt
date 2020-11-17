import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import Item from './Item';
import Map from './Map';
import { AppLoading } from 'expo';
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';

/*
This component will display all items in a highlighted sector from the map.
Most likely, we will pass a prop called items, which will be the input data.

Sample Usage:
    <ItemList/>

*/
const ItemList = () => {
    const renderSeparatorView = () => {
        return (
          <View style={{
              height: 1, 
              width: "100%",
              backgroundColor: "#CEDCCE",
              top:-15
            }}
          />
        );
      };
    const items = [
        {
            title: 'Cheetos',
            description: {
                brand: "Trader Joe's",
                quantity: "1 lb",
            },
        }, 
        {
            title: 'Chicken',
            description: {
                brand: "Trader Joe's",
                quantity: "1 lb",
          },
        },
        {
            title:"Beyond Meat",
            description: {
                brand: "Trader Joe's",
                quantity: "1 lb",
              },
        }
    ]
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});

    
    if (!fontsLoaded){
        return <AppLoading/>;
    }else{
        return (
            <Map>
                <View style={styles.whiteContainer}>
                    <>
                        <Text style={styles.heading}>Item List </Text>
                        <FlatList
                            data = {items}
                            renderItem = {({item}) => <Item item={item} handleDelete={() => {}} isCheckBox={true} mainViewStyle={{flexDirection:"row"}}/>}
                            keyExtractor = {(item, index) => index.toString()}
                            style={styles.list}          
                            ItemSeparatorComponent={renderSeparatorView}
                        />
                    </>
                </View>
            </Map>

        );
    }
}

const styles = StyleSheet.create({
    whiteContainer: {
        backgroundColor: '#FFFFFF',
        flex:1,
        borderRadius:5
    },
    heading : {
        fontSize:36,
        textAlign:"center",
        lineHeight:41,
        fontFamily:"ComicNeue_400Regular",
        position: "absolute",
        top:10,
        left:100
    },
    list : {
        position:"absolute",
        width:343,
        height:378,
        top:60,
        borderColor:'#000000'
    }
})

export default ItemList;