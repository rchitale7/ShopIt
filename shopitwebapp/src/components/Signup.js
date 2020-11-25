import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo_filled.png';

function Signup() {
  return (
    <>
      <img src={logo} className="img" />
      <div className="header">Welcome to ShopIt!</div>
      <div className="container">
        <button className="button"
            type="button"
            onClick={(e) => {
                e.preventDefault();
                window.location.href='/';
                }}
        >Log In</button>
      </div>
    </>
  );
}

export default Signup;
