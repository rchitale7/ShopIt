import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import success from './success.png';

function Success() {
  return (
    // <div className="success"></div>
    <img src={success} className="success"></img>
  );
}

export default Success;
