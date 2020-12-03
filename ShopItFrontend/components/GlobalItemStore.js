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
        Mark an item as retrieved
        type = 'markAsRetrieved'
        payload = _id for retrieved item
        */
        case 'markAsRetrieved':
            const retrievedItemIndex = state.groceryList.findIndex(item => item._id == action.payload);

            if (retrievedItemIndex == -1) {
                console.log("Trying to toggle the retrieved status of an item that does not exist");
                alert("Error: item does not exist");
                return state;
            }

            let newGroceryList = [...state.groceryList];

            newGroceryList[retrievedItemIndex] = {
                ...newGroceryList[retrievedItemIndex],
                retrieved: true
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

const retrieveStoreData = async (item) => {
    let re = RegExp('([^\d]) [0-9]{5,6}([^\d])');
    let formattedAddress = item.address
                    .replace(re, '$1$2')
                    .replace('Rd', 'Road')
                    .replace('Ave', 'Avenue')
                    .replace('Dr', 'Drive')
                    .replace('St', 'Street')
                    .replace('Stn', 'Station')
                    .replace('Cres', 'Crescent')
                    .replace('Bldg', 'Building')
                    .replace('Blvd', 'Boulevard')
                    .replace('Sq', 'Square');
    
    try {
        let res = await axios.get('/stores/at', {
            params: {
                name: item.name,
                address: formattedAddress
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
