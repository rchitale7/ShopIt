import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo_filled.png';

function Signup() {
  return (
    <>
      <img src={logo} className="img" />
      <div className="header">Welcome to ShopIt!</div>
      <div className="container">
        <form>
            <input className="input" type="text" id="username" placeholder="username..."/>
        </form>
        <form>
            <input className="input" type="text" id="password" placeholder="password..."/>
        </form>
        <button className="button"
            type="button"
            onClick={(e) => {
                e.preventDefault();
                var user = document.getElementById('username').value
                var pass = document.getElementById('password').value
                window.location.href='/';
                }}
        >Sign Up</button>
      </div>
    </>
  );
}

export default Signup;
