import React, { useState } from 'react';
import { FlatList,
         Text,
         View,
         Dimensions,
         Image,
         SafeAreaView,
         StyleSheet,
         Button,
         StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import Item from './Item';
import CollapsibleList from "react-native-collapsible-list";
import expand_icon from '../assets/expand.png'
import collapse_icon from '../assets/collapse.png'
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';


const InventorySearchSection = ({item}) => {
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});
    const [expanderSource, setExpanderSource] = useState(expand_icon);


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

    if(!fontsLoaded){
      return <AppLoading/>;
    } else{
        return (
          <CollapsibleList style={styles.container}
            numberOfVisibleItems={1}
            wrapperStyle={styles.container}
            buttonContent={
              <View style={styles.section}>
                <Text style={styles.title}>{item.type}</Text>
                <Image style={styles.expandIcon} source={expanderSource}/>
              </View>
            }
            buttonPosition="top"
            onToggle={collapsed =>
            collapsed
              ? setExpanderSource(collapse_icon)
              : setExpanderSource(expand_icon)
            }
          >
            <View style={styles.collapsibleItem}>
            </View>
            <View style={styles.collapsibleItem}>
              <FlatList style={styles.section}
                data={item.data}
                renderItem={({ item }) => <Item item={item} isCheckBox={true} strikeThrough={false} mainViewStyle={{flexDirection:"row"}}/>}
                keyExtractor={({ item, index }) => index}
                ItemSeparatorComponent={renderSeparatorView}
              />
            </View>
          </CollapsibleList>
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
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    expandIcon: {
      position: 'absolute',
      width: 30,
      height: 30,
      left: 270,
      bottom: 10,
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
    title: {
      fontSize: 32,
      fontFamily:"ComicNeue_400Regular",
    },
  });

  export default InventorySearchSection;
