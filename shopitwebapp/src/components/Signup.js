import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../index.css'

function Signup() {
  return (
    <>
      <div> sign up page! </div>
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
