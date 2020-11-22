import React, { useState, useEffect } from 'react';
import { FlatList,
         SectionList,
         Text,
         TextInput,
         TouchableOpacity,
         View,
         Dimensions,
         Image,
         SafeAreaView,
         StyleSheet,
         Button,
         StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import Item from './Item';
import InventorySearchSection from './InventorySearchSection';
import Collapsible from 'react-collapsible';
import CollapsibleList from "react-native-collapsible-list";
import search_icon from '../assets/search.png'
import expand_icon from '../assets/expand.png'
import erase_icon from '../assets/erase.png'
import collapse_icon from '../assets/collapse.png'
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';

const InventorySearch = () => {
  const [searchKey, setSearchKey] = useState('');
  const [expanderSource, setExpanderSource] = useState(collapse_icon);

  // TODO: change from hardcoded data to result from backend API query
  // assuming that a grocery is an object with a name and description field
  //All data format should be similar for consistency.
  const inventory = [
    { type: "Alcohol",
      data: [
        { title: 'bacardi', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'svedka', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Bakery",
      data: [
        { title: 'bagel', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'whole wheat bread', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'donut', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Beverages",
      data: [
        { title: 'guava juice', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'lemonade', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Candy",
      data: [
        { title: 'peanut m&ms', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'twix', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'whoppers', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Dairy & Substitutes",
      data: [
        { title: 'brie', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'goat cheese', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'oat milk', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Frozen Foods",
      data: [
        { title: 'bleach', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Meat",
      data: [
        { title: 'chicken', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'beef', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Pantry",
      data: [
        { title: 'baking soda', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'wheat flour', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'vanilla extract', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Produce",
      data: [
        { title: 'carrots', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'celery', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'chinese eggplant', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'zucchini', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    },
    { type: "Snacks",
      data: [
        { title: 'bacardi', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
        { title: 'goat milk', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      ],
    }, ];

  const renderSeparatorView = () => {
    return (
      <View style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CEDCCE",
          margin:5
        }}
      />
    );
  }

  let [fontsLoaded] = useFonts({ComicNeue_400Regular});
  // if the user has typed in the search bar, we display a filtered list of the inventory, and
  // we no longer separate by category
  let inventoryList;


  if (!searchKey) {
    inventoryList =
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <FlatList
            data={inventory}
            renderItem= {({ item }) => <InventorySearchSection item={item}/> }
            />
          </View>
      </View>
  }
  else {
    let filteredInventory = inventory
      .map(category => category.data) 
      .flat()
      .filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase()));

    inventoryList =
      <View style={styles.collapsibleItem}>
        <FlatList style={styles.section}
          data={filteredInventory}
          renderItem={({ item }) => <Item item={item} isCheckBox={true} strikeThrough={false}/>}
          keyExtractor={({ item, index }) => index}
          ItemSeparatorComponent={renderSeparatorView}
        />
      </View>
  }

  if (!fontsLoaded){
      return <AppLoading/>;
  } else{
    return (
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <TextInput style={styles.input}
            placeholder='Search for groceries!'
            onChangeText={text => setSearchKey(text)}
            defaultValue={searchKey}
          />
          <Image style={styles.searchIcon} source={search_icon}/>
          <TouchableOpacity onPress={() => setSearchKey('')} style={styles.addButton}>
              <Image style={styles.erase} source={erase_icon}/>
          </TouchableOpacity>
        </View>
        {inventoryList}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEE3',
    width: Dimensions.get('window').width,
    marginTop: StatusBar.currentHeight || 0,
  },
  subcontainer: {
    flex: 1,
    backgroundColor: '#FFFEE3',
    width: Dimensions.get('window').width,
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: 140,
  },
  searchIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: 30,
    bottom: 15,
  },
  expandIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: 270,
    bottom: 10,
  },
  erase: {
    position: 'absolute',
    width: 30,
    height: 30,
    bottom: 15,
    right: 40,
  },
  searchSection: {
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    width: 330,
    height: 50,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 50,
    borderRadius: 19,
    fontSize: 24,
    backgroundColor: '#FFFFFF',
    'borderStyle': 'solid',
    'borderWidth': 1,
    fontFamily:"ComicNeue_400Regular"
  },
  section: {
    'borderStyle': 'solid',
    'borderWidth': 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingLeft: 5,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: 30,
  },
});

export default InventorySearch;
