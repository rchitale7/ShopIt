import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../index.css'

function Signup() {
  return (
    <>
      <div> sign up page! </div>
      <form>
        <input type="text" id="username" placeholder="username..."/>
      </form>
      <form>
        <input type="text" id="password" placeholder="password..."/>
      </form>
      <div className="container">
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
