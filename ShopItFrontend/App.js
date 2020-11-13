import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GroceryStoreSearch from './components/GroceryStoreSearch';

export default function App() {
  return (
    <View style={styles.container}>
      <GroceryStoreSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});