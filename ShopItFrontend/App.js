import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InventorySearch from './components/InventorySearch';

export default function App() {
  return (
    <View style={styles.container}>
      <InventorySearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50
    //justifyContent: 'center',
  },
});
