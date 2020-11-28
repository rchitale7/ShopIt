import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import AddData from './components/AddData';
import Login from './components/Login';
import AutoLogin from './components/AutoLogin';
import Signup from './components/Signup';
import Success from './components/Success';
import DragAndDrop from './components/DragAndDrop';

function App() {
  return (
    <Router>
    <div>
      <Route exact path="/" component={Login} />
      <Route exact path="/login" component={AutoLogin} />
      <Route path="/signup" component={Signup} />
      <Route path="/adddata" component={AddData} />
      <Route path="/success" component={Success} />
      <Route path="/dragAndDrop" component={DragAndDrop} />
    </div>
  </Router>
  );
}
//test comment
export default App;
