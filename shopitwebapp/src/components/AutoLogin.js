import logo from './logo_filled.png';
import React, { useEffect } from 'react';

function autoAuthenticate() {
  fetch('http://localhost:5000/stores/'+window.localStorage.getItem("user"), {
    method: 'GET',
  }).then((getResponse) => {
    if(!getResponse.ok) {
      throw getResponse.json()
    }
    return getResponse.json()
  })
  .then((getResponseData) => {
    console.log(getResponseData)
    //get data if possible + populate addData
    window.location.href='/adddata';
  })
  .catch(error => {
    error.then(errorMsg => {
    alert(errorMsg.msg)
    window.location.href='/';
  })})
}

function AutoLogin() {
  useEffect(() => {
    autoAuthenticate();
  }, []);
  return (
    <>
      <h1>{window.localStorage.getItem("user")}</h1>
      <img src={logo} className="img" />
    </>
  );
}

export default AutoLogin;
