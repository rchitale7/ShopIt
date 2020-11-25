import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div> login page! </div>
      <form>
        <input type="text" id="username" placeholder="username"/>
      </form>
      <form>
        <input type="text" id="password" placeholder="password"/>
      </form>
      <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href='/signup';
            }}
      >Sign up</button>
      <button
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
    </>
  );
}

export default Login;
