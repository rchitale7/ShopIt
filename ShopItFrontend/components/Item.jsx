import React, {useState} from 'react';
import { StyleSheet, Text, View} from 'react-native';
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
const Item = ({item}) => {
    const {title} = item;
    const [selected, setCheckBox] = useState(false);
    let [fontsLoaded] = useFonts({ComicNeue_400Regular});

    if(!fontsLoaded){
        return <AppLoading />;
    }else{
        return (
            <View style={styles.itemDiv}>
                <>
                    {selected 
                        ? <Text style={styles.checkedItem}>{title}</Text>
                        :<Text style={styles.unCheckedItem}> {title}</Text>
                    }
                    <CheckBox
                        checked={selected}
                        onPress={ () => setCheckBox(!selected)}
                        style={{flexGrow:1}}
                    />
                </>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    unCheckedItem :{
        fontSize:25,
        lineHeight:28.75,
        flexGrow:1,
        fontFamily:'ComicNeue_400Regular'

    },
    checkedItem:{
        fontSize:25,
        lineHeight:28.75,

        flexGrow:1,
        textDecorationLine:'line-through',
        fontFamily:'ComicNeue_400Regular', 
        paddingLeft:8 //On selecting checkbox, this prevents the label from moving on the UI.

    },
    itemDiv :{
        padding:15,
        flexDirection:"row"

    }
})

export default Item;