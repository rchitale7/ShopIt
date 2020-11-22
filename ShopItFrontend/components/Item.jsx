import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { AppLoading } from 'expo';
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';
import erase_icon from '../assets/erase.png'

/*
This component is used to display a single item and a checkbox that we can
set to mark off the item as picked up.
Sample Usage:
<Item item={someItemObject}/>
*/
const Item = ({item, handleDelete, isCheckBox, strikeThrough}) => {
    const {title, description:{brand, quantity}} = item;
    const [selected, setCheckBox] = useState(false);
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});

    if(!fontsLoaded){
        return <AppLoading />;
    }else{
        return (
            <View style={isCheckBox ? styles.ItemListItem : styles.ShoppingCartItem}>
                <>
                    <View style={{flex:1, flexDirection:'column'}}>
                        <>
                            {selected && strikeThrough
                                ? <Text style={styles.selectedItem}>{title}</Text>
                                :<Text style={styles.unselectedItem}> {title}</Text>
                            }
                            <Text style={{marginLeft:8}}>{brand} {quantity}</Text>
                        </>
                    </View>
                    {isCheckBox
                    ? <CheckBox checked={selected} onPress={ () => setCheckBox(!selected)} style={{flexGrow:1}}/>
                    : <TouchableOpacity onPress={() => handleDelete(title)} style={styles.addButton}>
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

    },
    ItemListItem :{
        flexDirection:"row"
    },
    ShoppingCartItem:{
        flexDirection:"row",
        width:275
    }
})

export default Item;
