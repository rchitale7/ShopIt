import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div> login page! </div>
      <li>
        <Link to="/signup">Sign up</Link>
      </li>
      <li>
        <Link to="/adddata">Add Data</Link>
      </li>
    </>
  );
}

export default Login;
