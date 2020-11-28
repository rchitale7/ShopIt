import { useState } from 'react';

import Draggable from 'react-draggable';
import WebFont from 'webfontloader';

import Loading from './Loading.js';
import LocationPin from '../assets/location_pin.png';

function getMeta(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
}

function getImageDimensions(uri) {
    return getMeta(uri)
        .then((img) => {
            let w = img.width;
            let h = img.height; 

            return { 'width': w, 'height': h };
        })
        .catch(() => {
            throw new Error('Could not load map');
        })
}

function DragAndDrop() {
    // Replace with context variables later
    const groceryStoreMap = 'https://shopit-item-images.s3-us-west-2.amazonaws.com/floorplan-images/sample_map.png';
    const rawItems = [
        {
            _id: '5fb91f1727849d4eb446c8f5',
            xPos: 0,
            yPos: 0,
            name: "Healthy Apple",
            brand: "GMO Farm",
            category: "Fruit",
            price: 1.29,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/apple.png'
        },
        {
            _id: '5fb91ef4a75df917718cd3fz',
            xPos: 0,
            yPos: 0,
            name: "Garden Peach",
            brand: "Garden of Eden",
            category: "Fruit",
            price: 6.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        },
        {
            _id: '5fb91ef4a75df917718cd3fq',
            xPos: 0,
            yPos: 0,
            name: "Thicc Peach",
            brand: "Homegrown",
            category: "Fruit",
            price: 3.99,
            imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/item-images/peach.png'
        }
    ]

    // Dimensions of the grocery store map
    const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
    // Prevents the async setup from initiating more than once
    const [asyncStarted, setAsyncStarted] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [pinSize, setPinSize] = useState(50);
    // Contains the id of the popup to show
    const [displayPopup, setDisplayPopup] = useState(null);
    const [items, setItems] = useState(rawItems);

    WebFont.load({
        google: {
          families: ['Comic Neue']
        }
    });

    if (!asyncStarted) {
        setAsyncStarted(true);

        getImageDimensions(groceryStoreMap)
            .then((dim) => {
                setDimensions(dim);
                let newPinSize = Math.min(dim.height, dim.width)/20
                setPinSize(newPinSize);
                return newPinSize;
            })
            /** 
             * Add POST-SCALING item image dimensions to help center the popup box over the item pins -
             * remember that images are scaled according to twice the pin size
             */
            .then(async (pinSize) => {
                for (let i = 0; i < items.length; i++) {
                    await getImageDimensions(items[i].imageURL)
                        .then((dim) => {
                            setItems(prevItems => 
                                prevItems.map((item, index) => {
                                    let imageHeight = 2*pinSize;
                                    let imageWidth = imageHeight/dim.height * dim.width;
                                    return i === index ? {...item, imageHeight: imageHeight, imageWidth: imageWidth} : item
                                })
                            )
                        })
                }
            })
            .then(() => {
                setComponentLoaded(true);
            })
    }
    
    if (!componentLoaded) {
        return <Loading></Loading>
    } else {
        return (
            <div>
                <div style={{...styles.container, ...styles.heading}}>
                    Drag and drop your items!
                </div>

                <div style={styles.container}>
                    <div 
                        style={{
                                ...styles.backgroundImg,
                                backgroundImage: `url(${groceryStoreMap})`,
                                width: `${dimensions.width}px`,
                                height: `${dimensions.height}px`
                            }} 
                        draggable="false"
                    >
                        {items.map((item) => {
                            return (
                                <Draggable key={item._id} onStart={() => setDisplayPopup(item._id)} onStop={() => setDisplayPopup(null)}>
                                    <div>
                                        <div 
                                            style={{
                                                ...styles.popup,
                                                ...styles.popupText,
                                                left: pinSize/2 - (2*5 + item.imageWidth)/2, // horizontally centers the popup above the pin
                                                display: displayPopup === item._id ? 'flex' : 'none'
                                            }}
                                        >
                                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                            <div>{`${item.price}`}</div>
                                            <div>{item.category}</div>
                                            <div>{item.brand}</div>
                                            <img src={item.imageURL} alt='Could not load'
                                                style={{
                                                    height: item.imageHeight
                                                }}
                                            ></img>
                                        </div>
                                        <img style={{...styles.pin, height: pinSize}} src={LocationPin} draggable="false" alt='x'></img>
                                    </div>
                                </Draggable>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 50
    },
    heading: {
        fontFamily: 'Comic Neue',
        fontWeight: 'bold',
        fontSize: 50
    },
    backgroundImg: {
        backgroundImage: 'url(https://shopit-item-images.s3-us-west-2.amazonaws.com/floorplan-images/sample_map.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain'
    },
    pin: {
        position: 'absolute'
    },
    popup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -150,
        backgroundColor: 'white',
        border: '1px solid',
        borderRadius: '15px',
        padding: 5
    },
    popupText: {
        fontFamily: 'Comic Neue',
        fontSize: 10
    }
};

export default DragAndDrop;