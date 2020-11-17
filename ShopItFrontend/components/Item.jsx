import React, {useState} from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { AppLoading } from 'expo';
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';

/*
This component is used to display a single item and a checkbox that we can
set to mark off the item as picked up.

Sample Usage:
<Item item={someItemObject}/>

*/
const Item = ({item, handleDelete, isCheckBox}) => {
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
                            {selected 
                                ? <Text style={styles.selectedItem}>{title}</Text>
                                :<Text style={styles.unselectedItem}> {title}</Text>
                            }
                            {!isCheckBox && <Text style={{marginLeft:8}}>{brand} {quantity}</Text>}
                        </>
                    </View>
                    {isCheckBox 
                    ? <CheckBox checked={selected} onPress={ () => setCheckBox(!selected)} style={{flexGrow:1}}/>
                    : <Button onPress={ () => handleDelete(title)} style={{flexGrow:1}} title="X"/>
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