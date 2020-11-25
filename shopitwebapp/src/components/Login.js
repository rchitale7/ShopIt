import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo_filled.png';

function Login() {
  return (
    <>
      <img src={logo} className="img" />
      <div className="header">Are you a grocery store?</div>
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
              // check user and password here
              console.log(user + " " + pass);
              window.location.href='/adddata';
              }}
        >Log in</button>
        </div>
        <div className="minicontainer">
          <button className="button"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.location.href='/signup';
                }}
          >Sign up</button>
        </div>
    </>
  );
}

export default Login;
