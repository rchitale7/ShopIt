import React from 'react';
import Item from './Item';
import { SafeAreaView,
         View,
         FlatList,
         StyleSheet,
         Text,
         StatusBar,
         Button } from 'react-native';

class ShoppingCart extends React.Component {

  constructor(props){
    const data = [
      {
        title: 'bacardi',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'goat milk',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'Channa Masala',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'pita chips',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'baguette',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'Almond Joy',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'bleach',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
      {
        title: 'lime yogurt',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        },
      },
    ];
    super(props);
    this.state = {
      data: data,
    }

  }

  renderSeparatorView = () => {
    return (
      <View style={{
          height: 1, 
          width: "100%",
          backgroundColor: "#CEDCCE",
          margin:20
        }}
      />
    );
  };

  removeItem = (title) => {
    console.log("Removing " + title);
    this.setState({
       data: this.state.data.filter((_item) => _item.title !== title)
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Your Cart</Text>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => <Item item={item} strikeThrough={false} handleDelete={this.removeItem} isCheckBox={false} mainViewStyle={{flexDirection:"row", width:275}}/>}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparatorView}
        />
      </SafeAreaView> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  description: {
    fontSize: 24,
  },
});

export default ShoppingCart;
