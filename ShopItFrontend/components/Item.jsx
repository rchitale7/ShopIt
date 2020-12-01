import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import { CheckBox } from 'react-native-elements';
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';
import erase_icon from '../assets/erase.png';

import { useGlobalState, useGlobalDispatch } from './GlobalItemStore';

/*
This component is used to display a single item and a button to the side.
This button can be either a checkmark or an X mark.

Sample Usage:
<Item item={...} isCheckBox={...} mainViewStyle={...} />

item: the json containing all the information about the object. 
Below is the assumed json data format.
    {
        title: 'lime yogurt',
        brand: "Trader Joe's",
        size: "1 lb"
     }

isCheckBox: The boolean value to determine which button to display.

mainViewStyle: The associated style for the main view of the item component.

*/
const Item = ({item, isCheckBox, mainViewStyle}) => {
    const { title, brand, size} = item;
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});
    const dispatch = useGlobalDispatch();
    const globalState = useGlobalState();

    let selected = false;
    let strikeThrough = false;

    let groceryItem = globalState.groceryList.find(groceryItem => groceryItem._id == item._id);
    if (groceryItem) {
        selected = true;
        strikeThrough = groceryItem.retrieved && !isCheckBox;
    }

    const checkBoxPressed = () => {
        if (selected) {
            // the user unselected - remove item from cart
            dispatch({
                type: 'removeFromCart',
                payload: item._id
            });
        }
        else {
            // the user selected - add item to cart
            dispatch({
                type: 'addToCart',
                payload: {
                    ...item,
                    retrieved: false
                }
            });
        }
    };

    const deleteButtonPressed = () => {
        dispatch({
            type: 'removeFromCart',
            payload: item._id
        });
    };

    if (!fontsLoaded){
        // TODO: change to a loading wheel or something else
        return <Text></Text>;
    } else {
        return (
            <View style={mainViewStyle}>
                <>
                    <View style={{flex:1, flexDirection:'column'}}>
                        <>
                            {selected && strikeThrough
                                ? <Text style={styles.selectedItem}>{title}</Text>
                                :<Text style={styles.unselectedItem}> {title}</Text>
                            }
                            <Text style={[styles.unselectedItem, { marginLeft: 8, fontSize: 15 }]}>{brand} {size}</Text>
                        </>
                    </View>
                    {isCheckBox
                    ? <CheckBox checked={selected} onPress={ () => checkBoxPressed() } style={{flexGrow:1}}/>
                    : <TouchableOpacity onPress={() => deleteButtonPressed() } style={styles.addButton}>
                        <Image style={styles.erase} source={erase_icon}/>
                    </TouchableOpacity>
                    }
                </>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    unselectedItem :{
        fontSize:25,
        lineHeight:28.75,
        flexGrow:1,
        fontFamily:'ComicNeue_400Regular'
    },
    erase:{
      width: 30,
      height: 30,
    },
    selectedItem:{
        fontSize:25,
        lineHeight:28.75,
        flexGrow:1,
        textDecorationLine:'line-through',
        fontFamily:'ComicNeue_400Regular',
        paddingLeft:8 //On selecting checkbox, this prevents the label from moving on the UI.
    }
})

export default Item;
