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
              var user = document.getElementById('username').value;
              var pass = document.getElementById('password').value;
              window.localStorage.setItem("user", user); //used to add data
              // check user and password here
              fetch('http://localhost:5000/users/login', {
                credentials: 'include',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: user, password: pass}),
              }).then((response) => response.json())
              .then((responseData) => {
                console.log(responseData);
                window.location.href='/adddata';
                //return responseData;
              })
              .catch(error => console.warn(error));
              }}
        >Log in</button>
        </div>
        <div className="minicontainer">
          <div className='innertext'>New grocery store?</div>
          <button className="signupbutton"
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
