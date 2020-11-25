import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Signup() {
  return (
    <>
      <div> sign up page! </div>
      <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href='/';
            }}
      >Log In</button>
    </>
  );
}

export default Signup;
