import React, {useState} from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { CheckBox } from 'react-native-elements';
import {
    useFonts,
    ComicNeue_400Regular,
  } from '@expo-google-fonts/comic-neue';

/*
This component is used to display a single item and a button to the side.
This button can be either a checkmark or an X mark.

Sample Usage:
<Item item={...} handleDelete={...} isCheckBox={...} mainViewStyle={...} strikeThrough={...}/>

item: the json containing all the information about the object. 
Below is the assumed json data format.
    {
        title: 'lime yogurt',
        description: {
          brand: "Trader Joe's",
          quantity: "1 lb",
        }
     }

handleDelete: The event handler fcn for handling deletes in shopping cart.

isCheckBox: The boolean value to determine which button to display.

mainViewStyle: The associated style for the main view of the item component.

strikeThrough: boolean value to determine whether we display a strikethrough.

*/
const Item = ({item, handleDelete, isCheckBox, mainViewStyle, strikeThrough}) => {
    const {title, description:{brand, quantity}} = item;
    const [selected, setCheckBox] = useState(false);
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});

    if(!fontsLoaded){
        return <Text>Fonts haven't loaded just yet!</Text>;
    }else{
        return (
            <View style={mainViewStyle}>
                <>
                    <View style={{flex:1, flexDirection:'column'}}>
                        <>
                            {selected && strikeThrough
                                ? <Text style={styles.selectedItem}>{title}</Text>
                                :<Text style={styles.unselectedItem}> {title}</Text>
                            }
                            {!isCheckBox && <Text style={{marginLeft:8}}>{brand} {quantity}</Text>}
                        </>
                    </View>
                    {isCheckBox 
                        ? <CheckBox checked={selected} onPress={ () => setCheckBox(!selected)} style={{flexGrow:1}}/>
                        : <Button onPress={ () => handleDelete(title)} style={{flexGrow:1}} title="X" color="#841584"/>
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
    }
})

export default Item;
