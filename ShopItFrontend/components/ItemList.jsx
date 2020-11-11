import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import Item from './Item';
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

TO-DO: Think about the Map wrapper and how it may be implemented.
*/
const ItemList = () => {
    
    const items = [{title: 'Cheetos'}, {title: 'Chicken'},{title:"Beyond Meat"}]
    //const items = [{title: 'Cheetos'}, {title: 'Chicken'},{title:"Beyond Meat"}, {title:"Salsa Verde"},{title:"Oat Milk"},{title:"Bananas"},{title:"Hot Dogs"}]
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});
    
    if (!fontsLoaded){
        return <AppLoading/>;
    }else{
        return (
            <>
                <Text style={styles.heading}>Item List </Text>
                <FlatList
                    data = {items}
                    renderItem = {({item}) => <Item item={item}/>}
                    keyExtractor = {(item, index) => index.toString()}
                    style={styles.list}

                />
            </>

        );
    }
}

const styles = StyleSheet.create({

    heading : {
        fontSize:36,
        textAlign:"center",
        lineHeight:41,
        position:"absolute",
        width:208,
        height:51,
        left:80,
        top:100,
        fontFamily:"ComicNeue_400Regular"
    },
    list : {
        position:"absolute",
        width:343,
        height:378,
        top:160
    }
})

export default ItemList;