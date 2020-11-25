import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../index.css'

function Signup() {
  return (
    <>
      <div className="header">
          <h1>Welcome to ShopIt!</h1>
      </div>
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
