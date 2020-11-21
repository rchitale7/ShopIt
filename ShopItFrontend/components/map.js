import React, { useState } from 'react';

import { View, Text, Image, StyleSheet, Dimensions, ImageBackground, Modal, Pressable, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import ImageZoom from 'react-native-image-pan-zoom';

// Static assets
import SampleMap from '../assets/sample_map.png';
import LocationPin from '../assets/location_pin.png';

// Styles
import { Colors } from '../CommonStyles';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold  } from '@expo-google-fonts/comic-neue';

// Other
import { clusterItems, removeItemFromClusters } from './utils';

function Map() {
    const rawData = [
        {
            _id: '5fb91ef4a75df917718cd3ff',
            xPos: 110,
            yPos: 100,
            name: "Big Peach",
            brand: "Sunkist",
            category: "Fruit",
            price: 3.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
        {
            _id: '5fb91efe6697712645c5ca8f',
            xPos: 110,
            yPos: 124,
            name: "Small Peach",
            brand: "Trader Joe's",
            category: "Fruit",
            price: 6.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
        {
            _id: '5fb91f1727849d4eb446c8fe',
            xPos: 110,
            yPos: 148,
            name: "Juicy Peach",
            brand: "Minute Maid",
            category: "Fruit",
            price: 5.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        },
        {
            _id: '5fb91f214b8c5dd70ce5b57e',
            xPos: 300,
            yPos: 105,
            name: "Healthy Apple",
            brand: "Signature",
            category: "Fruit",
            price: 2.99,
            imageURL: 'https://lh3.googleusercontent.com/proxy/Y-SKDCNcvBVEtbPntgj9Ehitr28Wagbg5nOk1ZakpLaIcOzuRNRFUYXxWDNVUBwoDIA7HkaSf4LaQlRHwV0om_vy'
        },
        {
            _id: '5fb91f28301528be1054d9b1',
            xPos: 197,
            yPos: 400,
            name: "Rotten Peach",
            brand: "No Name",
            category: "Fruit",
            price: 1.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
        }
    ]
    
    const [fontsLoaded] = useFonts({ComicNeue_400Regular, ComicNeue_700Bold});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({"cluster": []});
    const [items, setItems] = useState(clusterItems(rawData, 50));

    // Pseudo component for bold text
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
                        <Pressable
                            style={{ position: 'absolute', top: 12, right: 12 }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Icon type='evilicon' name='close-o' color='lightgrey' size='25' />
                        </Pressable>
                        <ScrollView centerContent='true' showsVerticalScrollIndicator='false'>
                            {modalInfo.cluster.map((item) => {
                                return (
                                    <View style={{marginTop: 20, marginBottom: 20}}>
                                        <Text style={[styles.textStyle, {fontSize: 25}]}><B>{item.name}</B></Text>
                                        <Text style={styles.textStyle}><B>Brand:</B> {item.brand}</Text>
                                        <Text style={styles.textStyle}><B>Category:</B> {item.category}</Text>
                                        <Text style={styles.textStyle}><B>Price:</B> ${item.price}</Text>

                                        <Image 
                                            source={{ uri: item.imageURL }}
                                            style={{width: 200, height: 200, marginTop: 20, marginBottom: 20}} />
                                            
                                        <Pressable
                                            style={{ ...styles.modalButton }}
                                            onPress={() => {
                                                setModalVisible(!modalVisible);
                                                // TODO: replace with Bradley's context
                                                setItems(prevItems => removeItemFromClusters(prevItems, item));
                                            }}
                                        >
                                            <Text style={[styles.textStyle, {color: "white"}]}>Check off item</Text>
                                        </Pressable>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            
            <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height}
                        imageWidth={360}
                        imageHeight={600}>
                <ImageBackground source={SampleMap} style={{width: 360, height: 600}}>
                    {items.map((cluster) => {
                        if (cluster.cluster.length > 0) {
                            return (
                                <Pressable
                                    onPressIn={() => {
                                        setModalVisible(true);
                                        setModalInfo(cluster);
                                    }
                                }>
                                    <Image 
                                        source={LocationPin}
                                        style={[
                                            styles.locationPin, 
                                            styles.shadow,
                                            {left: cluster.xPos, top: cluster.yPos}
                                            ]}>
                                    </Image>
                                </Pressable>
                            )
                        }
                    })}
                    <Pressable
                        style={{ ...styles.modalButton, backgroundColor: 'coral', position: 'absolute', top: 10, left: 14 }}
                        onPress={() => {
                            setItems(clusterItems(rawData, 50));
                        }}
                    >
                        <Text style={[styles.textStyle, {color: "white"}]}>Reset</Text>
                    </Pressable>
                </ImageBackground>
            </ImageZoom>
        </View>
    );
}

export default Map;

const styles = StyleSheet.create({
    shadow: {
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 1,
            },
        shadowColor: 'dimgray',
        shadowRadius: 1
    },
    locationPin: {
        position: 'absolute',
        width: 20,
        height: 20
    },
    modalView: {
        height: 450,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 30,
        padding: 30,
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
    modalButton: {
        backgroundColor: Colors.green,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
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