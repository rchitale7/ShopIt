import React, { useState } from 'react';
import { FlatList,
         TextInput,
         TouchableOpacity,
         View,
         Dimensions,
         Image,
         StyleSheet,
         StatusBar,
         Text
} from 'react-native';

import Item from './Item';
import InventorySearchSection from './InventorySearchSection';

import search_icon from '../assets/search.png'
import erase_icon from '../assets/erase.png'
import collapse_icon from '../assets/collapse.png'

import { Colors } from '../CommonStyles';
import { useFonts, ComicNeue_400Regular } from '@expo-google-fonts/comic-neue';

import { useGlobalState } from './GlobalItemStore';

const InventorySearch = () => {
  const [searchKey, setSearchKey] = useState('');
  const [expanderSource, setExpanderSource] = useState(collapse_icon);

  const globalState = useGlobalState();

  // group items  by category
  // TODO: make categories consistent, possibly update backend to return categorized data
  const categories = ["Alcohol", "Bakery", "Beverages", "Candy", "Dairy", "Frozen Foods", "Fruit", "Meat", "Pantry", "Produce", "Snacks", "Wheat"];
  let categoryToItems = {};

  categories.forEach(category => {
    categoryToItems[category] = {
      type: category,
      data: []
    };
  });

  globalState.selectedStoreData.items.forEach(item => {
    categoryToItems[item.category].data.push({
      ...item,
      title: item.name
    });
  });

  const inventory = Array.from(Object.values(categoryToItems));

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
            keyExtractor={(item, index) => index.toString()}
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
          renderItem={({ item }) => <Item item={item} isCheckBox={true} strikeThrough={false} mainViewStyle={{flexDirection:"row"}}/>}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={renderSeparatorView}
        />
      </View>
  }

  if (!fontsLoaded){
    // TODO: change to a loading wheel or something else
    return <Text></Text>;
  } else {
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
    backgroundColor: Colors.beige,
    width: Dimensions.get('window').width,
    marginTop: StatusBar.currentHeight || 0,
    paddingTop: 20,
    paddingBottom: 40
  },
  subcontainer: {
    flex: 1,
    backgroundColor: Colors.beige,
    width: Dimensions.get('window').width,
    marginTop: StatusBar.currentHeight || 0
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
