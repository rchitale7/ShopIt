import React, { useState } from 'react';

import { View, Text, Image, StyleSheet, Dimensions, ImageBackground, Modal, Pressable, CheckBox } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';

import SampleMap from '../assets/sample_map.png';
import LocationPin from '../assets/location_pin.png';

function Map() {
    const locations = [
        {
            xPos: 110,
            yPos: 100,
            name: "Big Peach",
            brand: "Sunkist",
            category: "Fruit",
            price: 3.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
        {
            xPos: 110,
            yPos: 124,
            name: "Small Peach",
            brand: "Trader Joe's",
            category: "Fruit",
            price: 6.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
        {
            xPos: 110,
            yPos: 148,
            name: "Juicy Peach",
            brand: "Minute Maid",
            category: "Fruit",
            price: 5.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
        {
            xPos: 300,
            yPos: 105,
            name: "Healthy Apple",
            brand: "Signature",
            category: "Fruit",
            price: 2.99,
            imageURL: 'https://lh3.googleusercontent.com/proxy/KOezBLzcH4VsMYYNv5S-GA36mBYcW3cY4zR5Caz0YWWvi0Q9n8C_127njE4abpIvYcMWwnTCh8-vmNJ2dXPOvIQV'
        },
        {
            xPos: 197,
            yPos: 400,
            name: "Rotten Peach",
            brand: "No Name",
            category: "Fruit",
            price: 1.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
    ]
    
    const [fontsLoaded] = useFonts({ComicNeue_400Regular, ComicNeue_700Bold});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({});

    const B = (props) => <Text style={{fontFamily: 'ComicNeue_700Bold'}}>{props.children}</Text>

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={[styles.textStyle, {fontSize: 25}]}><B>{modalInfo.name}</B></Text>
                        <Text style={styles.textStyle}><B>Brand:</B> {modalInfo.brand}</Text>
                        <Text style={styles.textStyle}><B>Category:</B> {modalInfo.category}</Text>
                        <Text style={styles.textStyle}><B>Price:</B> ${modalInfo.price}</Text>

                        <Image 
                            source={{ uri: modalInfo.imageURL }}
                            style={{width: 200, height: 200, marginTop: 20, marginBottom: 20}} />

                        <Pressable
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={[styles.textStyle, {color: "white"}]}>Back to map</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            
            <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height}
                        imageWidth={360}
                        imageHeight={600}>
                <ImageBackground source={SampleMap} style={{width: 360, height: 600}}>
                    {locations.map(loc => {
                        return (
                            <Pressable
                                onPressIn={() => {
                                    setModalVisible(true);
                                    setModalInfo(loc);
                                }
                            }>
                                <Image 
                                    source={LocationPin}
                                    style={[
                                        styles.locationPin, 
                                        {left: loc.xPos, top: loc.yPos}
                                        ]}>
                                </Image>
                            </Pressable>
                        )
                    })}
                </ImageBackground>
            </ImageZoom>
        </View>
    );
}

export default Map;

const styles = StyleSheet.create({
    locationPin: {
        position: 'absolute',
        width: 20,
        height: 20
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 50,
        padding: 35,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    textStyle: {
        fontFamily:"ComicNeue_400Regular",
        fontWeight: "bold",
        textAlign: "center"
    }
});