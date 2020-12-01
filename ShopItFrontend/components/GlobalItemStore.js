import React from 'react';
import Constants from "expo-constants";
import Axios from 'axios';
const { manifest } = Constants;

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const groceryReducer = (state, action) => {
    switch (action.type) {
        /*
        Add the data for the selected store to the global state
        type = 'addStoreData'
        payload = data for the selected store
        */
        case 'addStoreData':
            return {
                groceryStoreSelected: true,
                groceryList: [],
                selectedStoreData: action.payload
            };

        /*
        Add an item to one's shopping cart
        type = 'addToCart'
        payload = item object to add to shopping cart
        */
        case 'addToCart':
            return {
                ...state,
                groceryList: [
                    ...state.groceryList,
                    action.payload
                ]
            };

        /*
        Remove an item from one's shopping cart
        type = 'removeFromCart'
        payload = _id for object to be removed from shopping cart
        */
        case 'removeFromCart':
            return {
                ...state,
                groceryList: state.groceryList.filter(item => item._id != action.payload)
            };

        /*
        Toggles whether an item is marked as retrieved or not
        type = 'toggleItemRetrievedStatus'
        payload = _id for item object to have its retrieved status toggled
        */
        case 'toggleItemRetrievedStatus':
            const retrievedItemIndex = state.groceryList.findIndex(item => item._id == action.payload);

            if (retrievedItemIndex == -1) {
                console.log("Trying to toggle the retrieved status of an item that does not exist");
                return state;
            }

            let newGroceryList = [...state.groceryList];

            newGroceryList[retrievedItemIndex] = {
                ...newGroceryList[retrievedItemIndex],
                retrieved: !newGroceryList[retrievedItemIndex].retrieved
            };

            return {
                ...state,
                groceryList: newGroceryList
            };

        default:
            return state;
    }
};

function GroceryProvider({children}) {

    const initialState = {
        groceryStoreSelected: false,
        groceryList: [],
        selectedStoreData: null
    };

    const [state, dispatch] = React.useReducer(groceryReducer, initialState);

    return (
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            {children}
          </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

function useGlobalState() {
    const context = React.useContext(StateContext)
    if (context === undefined) {
      throw new Error('useCountState must be used within a CountProvider')
    }
    return context
}
  
function useGlobalDispatch() {
    const context = React.useContext(DispatchContext)
    if (context === undefined) {
        throw new Error('useCountDispatch must be used within a CountProvider')
    }
    return context
}

// for querying backend API:

let groceryStoreData = null;

const getGroceryStoreData = () => {
    return groceryStoreData;
}

const axios = Axios.create({
    baseURL: `http://${manifest.debuggerHost.split(':').shift()}:5000/`
});

const retrieveStoreData = async () => {
    try {
        // FOR NOW ASSUMING THE SAME STORE ALWAYS
        const hardcodedName = "lucky's";
        const hardcodedAddress = "Foothill Expressway, Palo Alto, CA, USA";

        let res = await axios.get('/stores/at', {
            params: {
                name: hardcodedName,
                address: hardcodedAddress
            }
        });

        groceryStoreData = res.data;
    }
    catch (err) {
        groceryStoreData = null;
        console.log(err);
    }
};

export { 
    retrieveStoreData,
    getGroceryStoreData,
    GroceryProvider,
    useGlobalState,
    useGlobalDispatch
};
