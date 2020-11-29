import React from 'react';
import Constants from "expo-constants";
const { manifest } = Constants;

/*
const hardcodedGroceryStoreData = {
    _id: "5fc0478754df22a3ccf10c0c",
    floorPlan: "https://shopit-item-images.s3-us-west-2.amazonaws.com/floorplan-images/sample_map.png",
    name: "Ralph's Westwood",
    long: -118.44386700035668,
    lat: 34.063055385575225,
    items: [
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 301,
            posY: 211,
            _id: "5fc0478754df22a3ccf10c01",
            name: "Yogurt",
            category: "Dairy",
            brand: "Danimals",
            price: {
                "$numberDecimal": "2"
            },
            size: "12 oz",
            createdAt: "2020-11-27T00:25:43.251Z",
            updatedAt: "2020-11-27T00:25:43.251Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 300,
            posY: 200,
            _id: "5fc0478754df22a3ccf10c02",
            name: "Strawberry Ice Cream",
            category: "Dairy",
            brand: "Ben and Jerry's",
            price: {
                "$numberDecimal": "4"
            },
            size: "12 oz",
            createdAt: "2020-11-27T00:25:43.251Z",
            updatedAt: "2020-11-27T00:25:43.251Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 300,
            posY: 205,
            _id: "5fc0478754df22a3ccf10c03",
            name: "Mac and Cheese",
            category: "Dairy",
            brand: "Kraft's",
            price: {
                "$numberDecimal": "3.99"
            },
            size: "18 oz",
            createdAt: "2020-11-27T00:25:43.251Z",
            updatedAt: "2020-11-27T00:25:43.251Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 101,
            posY: 400,
            _id: "5fc0478754df22a3ccf10c04",
            name: "Cheerios",
            category: "Wheat",
            brand: "General Mills",
            price: {
                "$numberDecimal": "3.1"
            },
            size: "20 oz",
            createdAt: "2020-11-27T00:25:43.251Z",
            updatedAt: "2020-11-27T00:25:43.251Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 105,
            posY: 304,
            _id: "5fc0478754df22a3ccf10c05",
            name: "Chicken Nuggets",
            category: "Meat",
            brand: "Foster Farms",
            price: {
                "$numberDecimal": "4.99"
            },
            size: "8 oz",
            createdAt: "2020-11-27T00:25:43.251Z",
            updatedAt: "2020-11-27T00:25:43.251Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 112,
            posY: 125,
            _id: "5fc0478754df22a3ccf10c06",
            name: "Rum",
            category: "Alcohol",
            brand: "Bacardi",
            price: {
                "$numberDecimal": "29.99"
            },
            size: "10 oz",
            createdAt: "2020-11-27T00:25:43.251Z",
            updatedAt: "2020-11-27T00:25:43.251Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 125,
            posY: 43,
            _id: "5fc0478754df22a3ccf10c07",
            name: "Coca-cola",
            category: "Beverages",
            brand: "Coca-cola",
            price: {
                "$numberDecimal": "5.99"
            },
            size: "10 oz",
            createdAt: "2020-11-27T00:25:43.252Z",
            updatedAt: "2020-11-27T00:25:43.252Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 434,
            posY: 232,
            _id: "5fc0478754df22a3ccf10c08",
            name: "Apple",
            category: "Fruit",
            brand: "Apples Rock",
            price: {
                "$numberDecimal": "0.99"
            },
            size: "6 oz",
            createdAt: "2020-11-27T00:25:43.252Z",
            updatedAt: "2020-11-27T00:25:43.252Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 126,
            posY: 246,
            _id: "5fc0478754df22a3ccf10c0a",
            name: "Skittles",
            category: "Candy",
            brand: "Skittles",
            price: {
                "$numberDecimal": "2.99"
            },
            size: "3 oz",
            createdAt: "2020-11-27T00:25:43.252Z",
            updatedAt: "2020-11-27T00:25:43.252Z"
        },
        {
            imageURL: "https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png",
            posX: 23,
            posY: 67,
            _id: "5fc0478754df22a3ccf10c0b",
            name: "KitKat",
            category: "Candy",
            brand: "KitKat",
            price: {
                "$numberDecimal": "3.99"
            },
            size: "12 oz",
            createdAt: "2020-11-27T00:25:43.252Z",
            updatedAt: "2020-11-27T00:25:43.252Z"
        }
    ],
    createdAt: "2020-11-27T00:25:43.252Z",
    updatedAt: "2020-11-27T00:25:43.252Z",
    __v: 0
};
*/

let groceryStoreData = null;

const getGroceryStoreData = () => {
    return groceryStoreData;
}

const retrieveStoreData = async () => {
    try {
        const urlPrefix = `http://${manifest.debuggerHost.split(':').shift()}:5000/`;
    
        // FOR NOW IM JUST ASSUMING THEY ALWAYS PICK RALPHS WESTWOOD
        const ralphsLatitude = 34.063055385575225;
        const ralphsLongitude = -118.44386700035668;
    
        // get data for selected grocery store (FOR NOW JUST RALPHS WESTWOOD)
        let res = await fetch(urlPrefix + `stores/at?lat=${ralphsLatitude}&long=${ralphsLongitude}`);
        groceryStoreData = await res.json();
    }
    catch (err) {
        groceryStoreData = null;
        console.log(err);
    }
};


// assume an item in the shopping cart is an object with the following fields: name, description, retrieved

const ItemContext = React.createContext();

// state: {storeInventory, shoppingCart}

const itemReducer = (state, action) => {
    switch (action.type) {
        /*
        Initialize the global state
        type = 'addToCart'
        payload = initial global state
        */
        case 'initState':
            return action.payload

        /*
        Add an item to one's shopping cart
        type = 'addToCart'
        payload = item object to add to shopping cart
        */
        case 'addToCart':
            return {
                ...state,
                shoppingList: [
                    ...state.shoppingList,
                    action.payload
                ]
            };

        /*
        Remove an item from one's shopping cart
        type = 'removeFromCart'
        payload = item object to be removed from shopping cart
        */
        case 'removeFromCart':
            return {
                ...state,
                shoppingList: state.shoppingList.filter(item => {
                    return item.name != action.payload.name &&
                        item.description != action.payload.description &&
                        item.retrieved != action.payload.retrieved;
                })
            };

        /*
        Toggles whether an item is marked as retrieved or not
        type = 'toggleItemRetrievedStatus'
        payload = item object to have its retrieved status toggled
        */
        case 'toggleItemRetrievedStatus':
            const retrievedItemIndex = state.shoppingList.findIndex(item => {
                return item.name == action.payload.name && item.description == action.payload.description;
            });

            if (retrievedItemIndex == -1) {
                console.log("Trying to toggle the retrieved status of an item that does not exist");
                return state;
            }

            let newShoppingList = [...state.shoppingList];

            newShoppingList[retrievedItemIndex] = {
                ...newShoppingList[retrievedItemIndex],
                retrieved: !newShoppingList[retrievedItemIndex].retrieved
            };

            return {
                ...state,
                shoppingList: newShoppingList
            };

        default:
            return state;
    }
};

export { 
    retrieveStoreData,
    ItemContext,
    itemReducer,
    getGroceryStoreData
};

