import React, { useState } from 'react';
import { FlatList, SectionList, Text, TextInput, View } from 'react-native';

const InventorySearch = () => {
  const [searchKey, setSearchKey] = useState('');

  // TODO: change from hardcoded data to result from backend API query
  // assuming that a grocery is an object with a name and description field
  const inventory = [
      {title: 'Alcohol', data: [{name: 'bacardi', description: 'gross'}]},
      {title: 'Bakery', data: [{name: 'bread', description: 'good'}]},
      {title: 'Beverages', data: [{name: '7up', description: 'soda'}]},
      {title: 'Breakfast', data: [{name: 'cheerios', description: 'aight'}]},
      {title: 'Candy', data: [{name: 'reeses', description: 'great'}]},
      {title: 'Dairy & Substitutes', data: [{name: 'goat milk', description: 'idk'}]},
      {title: 'Frozen Foods', data: [{name: 'frozen pizza', description: 'ok'}]},
      {title: 'Meat', data: [{name: 'steak', description: 'yum'}]},
      {title: 'Pantry', data: [{name: 'pasta', description: 'penne'}]},
      {title: 'Produce', data: [{name: 'lettuce', description: 'ice berg'}]},
      {title: 'Snacks', data: [{name: 'goldfish', description: 'flavor blasted'}]}
  ]

  // if the user has typed in the search bar, we display a filtered list of the inventory, and
  // we no longer separate by category
  let inventoryList;
  if (!searchKey) {
    inventoryList = 
      <SectionList
        sections={inventory}
        renderItem={({item}) => <Text>{item.name}</Text>}
        renderSectionHeader={({section}) => <Text style={{fontWeight: "bold"}}>{section.title}</Text>}
        keyExtractor={(item, index) => index}
      />;
  }
  else {
    let filteredInventory = inventory
      .map(category => category.data)
      .flat()
      .filter(item => item.name.toLowerCase().includes(searchKey.toLowerCase()));
    
    inventoryList =
      <FlatList
        data={filteredInventory}
        renderItem={({item}) => <Text>{item.name}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />;
  }

  return (
    <View>
        <CheckBox
    disabled={false}
    value={toggleCheckBox}
    onValueChange={(newValue) => setToggleCheckBox(newValue)}
  />
      <TextInput 
        placeholder='Search for groceries!'
        onChangeText={text => setSearchKey(text)}
        defaultValue={searchKey}
      />
      {inventoryList}
    </View>
  );
}

export default InventorySearch;
