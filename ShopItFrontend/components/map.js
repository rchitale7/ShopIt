import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground, Modal, Pressable, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import ImageZoom from 'react-native-image-pan-zoom';

// Static assets
import LocationPin from '../assets/location_pin.png';

// Styles
import { Colors } from '../CommonStyles';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold  } from '@expo-google-fonts/comic-neue';

// Other
import { clusterItems, scaleItemPositions } from './utils';
import { useGlobalState, useGlobalDispatch } from './GlobalItemStore';

function Map() {
    const zoomableRegionHeight = 0.6 * Dimensions.get('window').height;

    const dispatch = useGlobalDispatch();
    const globalState = useGlobalState();
    
    // React hooks
    const [fontsLoaded] = useFonts({ComicNeue_400Regular, ComicNeue_700Bold});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState({"cluster": []});

    // Specific hooks that involve image scaling
    const [mapDimensions, setMapDimensions] = useState({ width: 500, height: 500 });
    const [pinSize, setPinSize] = useState(20);
    const [clusterRadius, setClusterRadius] = useState(20);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [items, setItems] = useState([]);

    /**
     * Asynchronously get the height and width of the map image, then scale and
     * cluster as needed
     */
    useEffect(() => {
        // Resize floorplan, pins, and items positions. Then cluster items
        Image.getSize(globalState.selectedStoreData.floorPlan, 
        (width, height) => {
            let imgRatio = width/height;
            let newWidth = imgRatio * zoomableRegionHeight;
            let newHeight = zoomableRegionHeight;
            let newPinSize = Math.min(newWidth, newHeight)/20;

            setMapDimensions({
                width: newWidth,
                height: newHeight
            });
            setPinSize(newPinSize);
            setClusterRadius(newPinSize);
            setItems(clusterItems(scaleItemPositions(globalState.groceryList.filter(item => !item.retrieved), zoomableRegionHeight, height), clusterRadius));

            setComponentLoaded(true);
        })
    }, [globalState.groceryList]);

    // Pseudo component for bold text
    const B = (props) => <Text style={{fontFamily: 'ComicNeue_700Bold'}}>{props.children}</Text>

    // Wait for fonts to load (useFonts is asynchronous)
    if (!fontsLoaded) return null;

    if (!componentLoaded) {
        return <Text>Loading</Text>
    } else {
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

                                                    dispatch({
                                                        type: 'markAsRetrieved',
                                                        payload: item._id
                                                    });
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
                    <ImageBackground source={{ uri: globalState.selectedStoreData.floorPlan }} style={mapDimensions}>
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
                                                    left: cluster.posX,
                                                    top: cluster.posY,
                                                    width: pinSize,
                                                    height: pinSize
                                                }
                                                ]}>
                                        </Image>
                                    </Pressable>
                                )
                            }
                        })}
                    </ImageBackground>
                </ImageZoom>
            </View>
        );
    }
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