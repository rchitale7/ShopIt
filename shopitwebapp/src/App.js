import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
  return (
    <Router>
    <div>
      <Route exact path="/" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/adddata" component={AddData} />
      <Route path="/success" component={Success} />
    </div>
  </Router>
  );
}

export default App;
