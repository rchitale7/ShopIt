import React from 'react';
import Item from './Item';
import { SafeAreaView,
         View,
         FlatList,
         StyleSheet,
         Dimensions,
         Text,
         Font,
         StatusBar,
         Button } from 'react-native';
import { useFonts,
         ComicNeue_400Regular,
} from '@expo-google-fonts/comic-neue';
import { AppLoading } from 'expo';

class ShoppingCart extends React.Component {
  state = {
        data:[],
        assetsLoaded: false,
  };

  async componentDidMount() {
        await Font.loadAsync({
            'ComicNeue_400Regular': require('@expo-google-fonts/comic-neue')
        }).then(() => {this.setState({ assetsLoaded: true })});
    }

  constructor(props){
    const data = [
      { title: 'bagel', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'donut', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'guava juice', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'lemonade', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'peanut m&ms', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'whoppers', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'brie', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'celery', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'zucchini', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
      { title: 'bleach', description: { brand: "Trader Joe's", quantity: "1 lb", }, },
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
          margin:10
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
    // if (!this.state.assetsLoaded){
    //     return <AppLoading/>;
    // } else{
      return (
        <View style={styles.container}>
          <View style={{marginTop: 10}}>
            <Text style={styles.title}>Your Cart</Text>
          </View>
          <FlatList style={styles.section}
            data={this.state.data}
            renderItem={({ item }) => <Item item={item} handleDelete={this.removeItem} isCheckBox={false} strikeThrough={false} mainViewStyle={{flexDirection:"row", width:275}}/>}
            keyExtractor={({ item, index }) => index}
            ItemSeparatorComponent={this.renderSeparatorView}
          />
        </View>
      );
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: '#FFFEE3',
  },
  title: {
    'textAlign': 'center',
    fontFamily:"ComicNeue_400Regular",
    fontSize: 32,
    padding: 10,
  },
  section: {
    'borderStyle': 'solid',
    'borderWidth': 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 130,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 10,
    paddingTop: 10,
    paddingRight: 5,
    paddingBottom: 5,
  },
});

export default ShoppingCart;
