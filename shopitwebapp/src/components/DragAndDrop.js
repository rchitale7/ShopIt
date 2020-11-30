import { useState } from 'react';
import { useHistory } from "react-router-dom";
import React, { useEffect } from 'react';

import Draggable from 'react-draggable';
import WebFont from 'webfontloader';
import Axios from 'axios';
import { Button } from '@material-ui/core';

import { getRemoteImageDimensions } from '../utils/utils.js';
import Loading from './Loading.js';
import LocationPin from '../assets/location_pin.png';

const axios = Axios.create({
    baseURL: 'http://localhost:5000/'
  });

WebFont.load({
    google: {
        families: ['Comic Neue']
    }
});

// function getMapData() {
//   fetch('http://localhost:5000/stores/'+window.localStorage.getItem("user"), {
//     credentials: 'include',
//     method: 'GET',
//   }).then((getResponse) => {
//     if(!getResponse.ok) {
//       throw getResponse.json()
//     }
//     return getResponse.json()
//   })
//   .then((getResponseData) => {
//     console.log(getResponseData)
//     if(getResponseData.exists) {
//       window.localStorage.setItem("name", getResponseData.name)
//       window.localStorage.setItem("address", getResponseData.address)
//       window.localStorage.setItem("items", getResponseData.items)
//       console.log(window.localStorage.getItem("items"))
//       window.localStorage.setItem("floorPlan", getResponseData.floorPlan)
//       window.localStorage.setItem("storeId", getResponseData.storeId)
//     }
//     else {
//       window.localStorage.setItem("name", null)
//       window.localStorage.setItem("address", null)
//       window.localStorage.setItem("items", [])
//       window.localStorage.setItem("storeId", getResponseData.storeId)
//     }
//   })
//   .catch(error => {
//   })
// }

function DragAndDrop() {
    // useEffect(() => {
    //   getMapData();
    // }, []);
    // Replace with context variables later
    const storeId = window.localStorage.getItem("storeId")
    const groceryStoreMap = window.localStorage.getItem("floorPlan");

    // Dimensions of the grocery store map
    const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
    // Prevents the async setup from initiating more than once
    const [asyncStarted, setAsyncStarted] = useState(false);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [pinSize, setPinSize] = useState(50);
    // Contains the item _id of the popup to show
    const [itemOnDrag, setItemOnDrag] = useState(null);
    const [items, setItems] = useState(window.localStorage.getItem("items"));
    // Routing
    const history = useHistory();

    function sendUpdate(storeId, items) {
        let itemIds = [];
        let itemLocations = [];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.moved) {
                itemIds.push(item._id);
                itemLocations.push({ 'posX': item.posX, 'posY': item.posY });
            }
        }

        axios.put('/items/locations', {
            storeId: storeId,
            itemIds: itemIds,
            itemLocations: itemLocations
        })
        .then(() => {
          history.push("/adddata")
          document.body.style.backgroundColor = '#91E78C';
        })
        .catch(() => alert("Could not update locations"));
    }

    let handleDrag = (e, ui) => {
        // Use a small hack - displayPopup contains the _id of the item being dragged
        setItems(prevItems =>
            prevItems.map((item, index) => {
                return item._id === itemOnDrag ?
                    {
                        ...item,
                        posX: ui.x,
                        posY: ui.y,
                        moved: true
                    }
                    : item
            })
        );
    };

    if (!asyncStarted) {
        setAsyncStarted(true);

        // Change color
        document.body.style.backgroundColor = '#FFFEE3';

        axios.get('/items', {
            params: {
                storeId: storeId
            }
        })
        .then((res) => {
            let resItems = res.data;
            setItems(resItems);

            getRemoteImageDimensions(groceryStoreMap)
                .then((dim) => {
                    setDimensions(dim);
                    let newPinSize = Math.min(dim.height, dim.width)/20
                    setPinSize(newPinSize);
                    return newPinSize;
                })
                .then((pinSize) => {
                    setComponentLoaded(true);
                    return pinSize;
                })
                /**
                 * Add POST-SCALING item image dimensions to help center the popup box over the item pins -
                 * remember that images are scaled according to twice the pin size
                 *
                 * Also adds deltaX and deltaY properties to item for tracking pin movement
                 */
                .then(async (pinSize) => {
                    for (let i = 0; i < resItems.length; i++) {
                        await getRemoteImageDimensions(resItems[i].imageURL)
                            .then((dim) => {
                                setItems(prevItems =>
                                    prevItems.map((item, index) => {
                                        let imageHeight = 2*pinSize;
                                        let imageWidth = imageHeight/dim.height * dim.width;
                                        return i === index ?
                                            {
                                                ...item,
                                                imageHeight: imageHeight,
                                                imageWidth: imageWidth,
                                                moved: false
                                            }
                                            : item
                                    })
                                )
                            })
                    }
                })
                .catch(() => alert("Could not retrieve item images!"));
        })
        .catch(() => alert("Could not retrieve items!"));
    }

    if (!componentLoaded) {
        return <Loading></Loading>
    } else {
        return (
            <div style={styles.all}>
                <div style={{...styles.container, ...styles.heading}}>
                    Reposition your items!
                </div>

                <div style={{...styles.container}}>
                    Click <Button style={styles.button} variant="outlined" onClick={() => sendUpdate(storeId, items)}>Update</Button> when you are done.
                </div>

                <div style={styles.container}>
                    <div
                        style={{
                                ...styles.backgroundImg,
                                backgroundImage: `url(${groceryStoreMap})`,
                                width: `${dimensions.width}px`,
                                height: `${dimensions.height}px`
                            }}
                    >
                        {items.map((item, index) => {
                            return (
                                <Draggable
                                    key={item._id}
                                    defaultPosition={{x: item.posX, y: item.posY}}
                                    onStart={() => setItemOnDrag(item._id)}
                                    onStop={() => setItemOnDrag(null)}
                                    onDrag={handleDrag}
                                >
                                    <div>
                                        <div
                                            style={{
                                                ...styles.popup,
                                                /**
                                                 * Horizontally centers the popup above the pin
                                                 * Also produces 'Warning: `NaN` is an invalid value...'
                                                 */
                                                left: pinSize/2 - (2*5 + item.imageWidth)/2,
                                                display: itemOnDrag === item._id ? 'flex' : 'none'
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
    all: {
        fontFamily: 'Comic Neue'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    heading: {
        fontSize: 50
    },
    backgroundImg: {
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
        padding: 5,
        fontSize: 10
    },
    button: {
        margin: 10,
        fontSize: 15,
        backgroundColor: 'rgba(145, 231, 140, 0.5)'
    }
};

export default DragAndDrop;
