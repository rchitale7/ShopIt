import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import GroceryStoreSearch from './components/GroceryStoreSearch';
import Menu from './components/navigation';
import Map from './components/map';
import InventorySearch from './components/InventorySearch';
import ShoppingCart from './components/ShoppingCart';
import ItemList from './components/ItemList';

import { retrieveStoreInventory, ItemContext, itemReducer } from './components/GlobalItemStore';

export default function App() {
  const [ mode, setMode ] = useState("Search");
  const changeMode = (newMode) => { setMode(newMode) };

  const initialState = {
    storeInventory: retrieveStoreInventory(),
    shoppingList: [] 
  };

  const [itemState, dispatch] = React.useReducer(itemReducer, initialState);

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
      <ItemContext.Provider 
        value={{
          itemState,
          dispatch
        }}
      >
      
        {/*
        <Mode></Mode>
        */}

        <TestComp/>


        {/*
        <Menu pressCallback={changeMode}></Menu>
        */}
        <StatusBar style="auto" />
      </ItemContext.Provider>
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

const TestComp = () => {

  // retrieve itemState (global state) amd dispatch (function to update global state) from context
  const {itemState, dispatch} = React.useContext(ItemContext);

  // access all of the inventory
  //console.log(itemState.storeInventory);

  // access the groceries on the user's shopping list
  console.log(itemState.shoppingList);

  // update the global state by using dispatch to perform an action
  return <Text onPress={() => dispatch({
    type: 'toggleItemRetrievedStatus',
    //type: 'addToCart',
    payload: {
      name: 'test', 
      description: 'test item', 
      retrieved: false
    }
  })}>
    test
  </Text>;
}