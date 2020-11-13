

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import GroceryStoreSearch from './components/GroceryStoreSearch';
import Menu from './components/navigation';
import Map from './components/map';
import InventorySearch from './components/InventorySearch';
import ShoppingCart from './components/ShoppingCart';
import ItemList from './components/ItemList';

export default function App() {
  const [ mode, setMode ] = useState("Map");
  const changeMode = (newMode) => { setMode(newMode) };

  function Mode() {
    if (mode == "Map") {
      return <Map></Map>;
    }
    else if (mode == "Cart") {
      return <ShoppingCart></ShoppingCart>
    }
    else if (mode == "Search") {
      return <InventorySearch></InventorySearch>
    }
  }
  
  return (
    <View style={styles.container}>
      <Mode></Mode>
      <Menu pressCallback={changeMode}></Menu>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
