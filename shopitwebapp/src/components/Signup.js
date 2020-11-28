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
            <input className="input" type="text" id="password" placeholder="password..." type="password"/>
        </form>
        <button className="button"
            type="button"
            onClick={(e) => {
                e.preventDefault();
                var user = document.getElementById('username').value
                var pass = document.getElementById('password').value
                fetch('http://localhost:5000/users/signup', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({username: user, password: pass}),
                }).then((response) => {
                  if(!response.ok) {
                    throw response.json()
                  }
                  return response.json()
                })
                .then((responseData) => {
                  window.location.href='/';
                })
                .catch(error => error.then(errorMsg => alert(errorMsg)));
                }}
        >Sign Up</button>
      </div>
    </>
  );
}

function validate() {
  return alert('All inputs must be filled out')
}

export default Signup;
