import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AddData from './components/AddData';
import Login from './components/Login';
import Signup from './components/Signup';
import Success from './components/Success';
import DragAndDrop from './components/DragAndDrop';

function App() {
  return (
    <Router>
    <div>
      <Route exact path="/" component={DragAndDrop} />
      <Route path="/signup" component={Signup} />
      <Route path="/adddata" component={AddData} />
      <Route path="/success" component={Success} />
    </div>
  </Router>
  );
}
//test comment
export default App;
