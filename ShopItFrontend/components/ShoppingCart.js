import React from 'react';
import Item from './Item';
import { View,
         FlatList,
         StyleSheet,
         Dimensions,
         Text
} from 'react-native';

import { Colors } from '../CommonStyles';
import { useFonts, ComicNeue_400Regular } from '@expo-google-fonts/comic-neue';

import { useGlobalState } from './GlobalItemStore';

const ShoppingCart = () => {

  const globalState = useGlobalState();

  let [fontsLoaded] = useFonts({ComicNeue_400Regular});

  renderSeparatorView = () => {
    return (
      <View style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CEDCCE",
          margin:10
        }}
      />
    );
  };

  if (!fontsLoaded) {
    return <Text></Text>;
  }
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Your Cart</Text>
      </View>
      <FlatList style={styles.section}
        data={globalState.groceryList}
        renderItem={({ item }) => <Item item={item} isCheckBox={false} mainViewStyle={{flexDirection:"row", width: Dimensions.get('window').width - 60}}/>}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={this.renderSeparatorView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: Colors.beige,
  },
  title: {
    textAlign: 'center',
    fontFamily: "ComicNeue_400Regular",
    fontSize: 32,
    padding: 10,
  },
  section: {
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 90,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 5,
  },
});

export default ShoppingCart;
