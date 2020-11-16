import React from 'react';
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

  removeItem(title) {
    console.log("Removing " + title);
    this.setState({
       data: this.state.data.filter((_item) => _item.title !== title)
    });
  }

  renderItem(item) {
    console.log("Creating item " + item.title);
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.descripton}>
          {item.description.brand}, {item.description.quantity}
        </Text>
        <Button
          onPress={() => this.removeItem(item.title)}
          title="x"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Your Cart</Text>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={({ item, index }) => index}
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
