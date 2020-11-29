import React from 'react';
import Constants from "expo-constants";
const { manifest } = Constants;

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const groceryReducer = (state, action) => {
    switch (action.type) {

        // TODO: delete later
        case 'printstate':
            console.log(state.groceryList);
            return state;

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


        // TODO: implement this case correctly

        /*
        Toggles whether an item is marked as retrieved or not
        type = 'toggleItemRetrievedStatus'
        payload = item object to have its retrieved status toggled
        */
        case 'toggleItemRetrievedStatus':
            const retrievedItemIndex = state.groceryList.findIndex(item => {
                return item.name == action.payload.name && item.description == action.payload.description;
            });

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
    const [state, dispatch] = React.useReducer(groceryReducer, {count: 0});
    return (
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            {children}
          </DispatchContext.Provider>
        </StateContext.Provider>
    )
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

export { 
    retrieveStoreData,
    getGroceryStoreData,
    GroceryProvider,
    useGlobalState,
    useGlobalDispatch
};
