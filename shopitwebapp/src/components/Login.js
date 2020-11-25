import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div> login page! </div>
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
            window.location.href='/adddata';
            }}
      >Log in</button>
    </>
  );
}

export default Login;
