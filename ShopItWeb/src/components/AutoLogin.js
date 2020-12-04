import Logo from '../assets/logo_filled.png';
import React, { useEffect } from 'react';

function autoAuthenticate() {
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
      window.localStorage.setItem("name", null)
      window.localStorage.setItem("address", null)
    }
    window.location.href='/adddata';
  })
  .catch(error => {
    window.location.href='/';
  })
}

function AutoLogin() {
  useEffect(() => {
    autoAuthenticate();
  }, []);
  return (
    <>
      <img src={Logo} className="img" alt="ShopIt" />
    </>
  );
}

export default AutoLogin;
