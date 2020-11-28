import logo from './logo_filled.png';
// import autoAuthenticate from './AutoLogin'

function Login() {
  // useEffect(() => {
  //   autoAuthenticate();
  // }, []);
  return (
    <>
      <img src={logo} className="img" />
      <div className="header">Are you a grocery store?</div>
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
              }).then((response) => {
                if(!response.ok) {
                  throw response.json()
                }
                return response.json()
              })
              .then((responseData) => {
                fetch('http://localhost:5000/stores/'+window.localStorage.getItem("user"), {
                  credentials: 'include',
                  method: 'GET',
                }).then((getResponse) => {
                  if(!getResponse.ok) {
                    throw getResponse.json()
                  }
                  return getResponse.json()
                })
                .then((getResponseData) => {
                  console.log(getResponseData)
                  if(getResponseData.exists) {
                    window.localStorage.setItem("name", getResponseData.name)
                    window.localStorage.setItem("address", getResponseData.address)
                  }
                  else {
                    window.localStorage.removeItem("name")
                    window.localStorage.removeItem("address")
                  }
                  window.location.href='/adddata';
                })
                .catch(error => {
                  error.then(errorMsg => {
                  alert(errorMsg.msg)
                  window.location.href='/';
                })})
              })
              .catch(error => {error.then(errorMsg => alert(errorMsg.msg))});
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
