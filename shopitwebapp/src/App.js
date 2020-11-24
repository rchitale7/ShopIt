import React, { useState } from 'react';
import AddData from './components/AddData';
import Login from './components/Login';
import Signup from './components/Signup';
import Success from './components/Success';

function App() {
  const [ mode, setMode ] = useState("Login");
  const changeMode = (newMode) => { setMode(newMode) };

  function Mode() {
    if (mode == "Login") {
      return <Login></Login>;
    }
    else if (mode == "Signup") {
      return <Signup></Signup>
    }
    else if (mode == "AddData") {
      return <AddData></AddData>
    }
    else if (mode == "Success" ) {
      return <Success></Success>
    }
  }

  var page = {
    width: '100%',
    height: '100%',
    backgroundColor: '#91E78C'
  }

  return (
    <div style={page}>
      {/* <Login /> */}
      <Signup/>
    </div>
  );
}

export default App;
