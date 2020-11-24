import React from 'react';

// TODO: change this function to query backend API
const retrieveStoreInventory = () => {
    const storeInventory = [{name: 'bacardi', description: 'alc'}];
    return storeInventory;
};

// assume an item in the shopping cart is an object with the following fields: name, description, retrieved

const ItemContext = React.createContext();

// state: {storeInventory, shoppingCart}

const itemReducer = (state, action) => {
    switch (action.type) {
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
    retrieveStoreInventory, 
    ItemContext,
    itemReducer
};

