import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Menu from './components/navigation';
import Map from './components/map';
import Search from './components/search';
import Cart from './components/cart';

export default function App() {
  const [ mode, setMode ] = useState("Map");
  const changeMode = (newMode) => { setMode(newMode) };

  function Mode() {
    if (mode == "Map") {
      return <Map></Map>;
    }
    else if (mode == "Cart") {
      return <Cart></Cart>
    }
    else if (mode == "Search") {
      return <Search></Search>
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
