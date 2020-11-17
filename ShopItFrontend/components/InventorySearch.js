import React, { useState } from 'react';
import { FlatList, SectionList, Text, TextInput, View } from 'react-native';
import Item from './Item';

const InventorySearch = () => {
  const [searchKey, setSearchKey] = useState('');

  // TODO: change from hardcoded data to result from backend API query
  // assuming that a grocery is an object with a name and description field
  //All data format should be similar for consistency.
  const inventory = [
      {category: 'Alcohol', data: [{title: 'bacardi', description: {brand: 'kroger', quantity: "22oz"}}, {title:'cognac', description:{brand:'hennessy', quantity:"24oz"}}]},
      {category: 'Bakery', data: [{title: 'bread', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Beverages', data: [{title: '7up', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Breakfast', data: [{title: 'cheerios', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Candy', data: [{title: 'reeses', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Dairy & Substitutes', data: [{title: 'goat milk', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Frozen Foods', data: [{title: 'frozen pizza', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Meat', data: [{title: 'steak', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Pantry', data: [{title: 'pasta', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Produce', data: [{title: 'lettuce', description: {brand: 'kroger', quantity: "1lb"}}]},
      {category: 'Snacks', data: [{title: 'goldfish', description: {brand: 'kroger', quantity: "1lb"}}]}
  ];

  // if the user has typed in the search bar, we display a filtered list of the inventory, and
  // we no longer separate by category
  let inventoryList;
  if (!searchKey) {
    inventoryList = 
      <SectionList
        sections={inventory}
        renderItem={({item}) => <Item item={item} isCheckBox={true} handleDelete={() => {}} mainViewStyle={{flexDirection:"row", width:300}}/>}
        renderSectionHeader={({section}) => <Text style={{fontWeight: "bold"}}>{section.category}</Text>}
        keyExtractor={(item, index) => index}
      />;
  }
  else {
    let filteredInventory = inventory
      .map(category => category.data) 
      .flat()
      .filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase())); 

    inventoryList =
      <FlatList
        data={filteredInventory}
        renderItem={({item}) => <Item item={item} isCheckBox={true} handleDelete={() => {}} mainViewStyle={{flexDirection:"row", width:300}}/>}
        keyExtractor={(item, index) => index.toString()}
      />;
  }

  return (
    <View>
      <TextInput 
        placeholder='Search for groceries!'
        onChangeText={text => setSearchKey(text)}
        defaultValue={searchKey}
        style={{marginTop:50, fontSize:26}}
      />
      {inventoryList}
    </View>
  );
}

export default InventorySearch;
