import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Signup() {
  return (
    <>
      <div> sign up page! </div>
      <li>
        <Link to="/">Log in</Link>
      </li>
    </>
  );
}

export default Signup;
