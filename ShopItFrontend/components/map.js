import React, { useState } from 'react';

import { View, Text, Image, StyleSheet, Dimensions, ImageBackground, Modal, Pressable, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import ImageZoom from 'react-native-image-pan-zoom';

// Static assets
import LocationPin from '../assets/location_pin.png';

// Styles
import { Colors } from '../CommonStyles';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold  } from '@expo-google-fonts/comic-neue';

// Other
import { clusterItems, removeItemFromClusters, scaleItemPositions } from './utils';

function Map(props) {
    const { pinSize = 20 } = props;
    const clusterRadius = pinSize;
    const zoomableRegionHeight = 0.6 * Dimensions.get('window').height;

    const groceryStore = {
        name: "Trade Joe's",
        lat: 100,
        long: 100,
        floorplanURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/floorplan-images/sample_map.png'
    }
    
    const rawData = [
        {
            _id: '5fb91ef4a75df917718cd3ff',
            xPos: 390,
            yPos: 220,
            name: "Big Peach",
            brand: "Sunkist",
            category: "Fruit",
            price: 3.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        },
        {
            _id: '5fb91ef4a75df917718cd3fz',
            xPos: 391,
            yPos: 220,
            name: "Good Apple",
            brand: "Garden of Eden",
            category: "Fruit",
            price: 6.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/apple.png'
        },
        {
            _id: '5fb91ef4a75df917718cd3fq',
            xPos: 387,
            yPos: 230,
            name: "Thicc Peach",
            brand: "Homegrown",
            category: "Fruit",
            price: 10.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        },
        {
            _id: '5fb91efe6697712645c5ca8f',
            xPos: 282,
            yPos: 607,
            name: "Small Peach",
            brand: "Trader Joe's",
            category: "Fruit",
            price: 6.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        },
        {
            _id: '5fb91f1727849d4eb446c8fe',
            xPos: 608,
            yPos: 239,
            name: "Juicy Peach",
            brand: "Minute Maid",
            category: "Fruit",
            price: 5.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        },
        {
            _id: '5fb91f214b8c5dd70ce5b57e',
            xPos: 153,
            yPos: 813,
            name: "Healthy Apple",
            brand: "Signature",
            category: "Fruit",
            price: 2.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/apple.png'
        },
        {
            _id: '5fb91f28301528be1054d9b1',
            xPos: 605,
            yPos: 1133,
            name: "Rotten Peach",
            brand: "No Name",
            category: "Fruit",
            price: 1.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        }
    ]
    
    // React hooks
    const [fontsLoaded] = useFonts({ComicNeue_400Regular, ComicNeue_700Bold});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({"cluster": []});

    // Specific hooks that involve image scaling
    const [mapDimensions, setMapDimensions] = useState({ width: 500, height: 500 });
    const [actualMapDimensions, setActualMapDimensions] = useState({width: 0, height: 0});
    const [mapLoaded, setMapLoaded] = useState(false);
    const [items, setItems] = useState([]);

    /**
     * Asynchronously get the height and width of the map image, then scale and
     * cluster as needed
     */
    if (!mapLoaded) {
        setMapLoaded(true);
        Image.getSize('https://shopit-item-images.s3-us-west-2.amazonaws.com/floorplan-images/sample_map.png', 
            (width, height) => {
                let imgRatio = width/height;

                setActualMapDimensions({
                    width: width,
                    height: height
                });
                setMapDimensions({
                    width: imgRatio * zoomableRegionHeight,
                    height: zoomableRegionHeight
                });
                setItems(clusterItems(scaleItemPositions(rawData, zoomableRegionHeight, height), clusterRadius));
            })
    }

    // Pseudo component for bold text
    const B = (props) => <Text style={{fontFamily: 'ComicNeue_700Bold'}}>{props.children}</Text>

    // Wait for fonts to load (useFonts is asynchronous)
    if (!fontsLoaded) return null;

    return (
        <View style={{ backgroundColor: Colors.beige }}>
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
                            <Icon type='evilicon' name='close-o' color='lightgrey' size={25} />
                        </Pressable>
                        <ScrollView centerContent='true' showsVerticalScrollIndicator='false'>
                            {modalInfo.cluster.map((item) => {
                                return (
                                    <View style={{marginTop: 20, marginBottom: 20}} key={item._id}>
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
                        imageWidth={mapDimensions.width}
                        imageHeight={mapDimensions.height}>
                <ImageBackground source={{ uri: groceryStore.floorplanURL }} style={mapDimensions}>
                    {items.map((cluster) => {
                        if (cluster.cluster.length > 0) {
                            return (
                                <Pressable
                                    onPressIn={() => {
                                        setModalVisible(true);
                                        setModalInfo(cluster);
                                    }}
                                    key={cluster._id}
                                >
                                    <Image 
                                        source={LocationPin}
                                        style={[
                                            styles.locationPin,
                                            {
                                                left: cluster.xPos,
                                                top: cluster.yPos,
                                                width: pinSize,
                                                height: pinSize
                                            }
                                            ]}>
                                    </Image>
                                </Pressable>
                            )
                        }
                    })}
                    <Pressable
                        style={{ ...styles.modalButton, backgroundColor: 'coral', position: 'absolute', top: 10, left: 14 }}
                        onPress={() => {
                            setItems(clusterItems(scaleItemPositions(rawData, zoomableRegionHeight, actualMapDimensions.height), clusterRadius));
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