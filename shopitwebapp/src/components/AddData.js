import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from './logo_filled.png';

function AddData() {
  return (
    <>
      <img src={logo} className="img" />
      <div className="header">Update store data!</div>
      <div className="datacontainer">
        <form>
          <input className="input" type="text" id="name" placeholder="name..."/>
        </form>
        <form>
          <input className="input" type="text" id="latitude" placeholder="latitude..."/>
        </form>
        <form>
          <input className="input" type="text" id="longitude" placeholder="longitude..."/>
        </form>
        <div className="innertext">Inventory</div>
        <form>
          <input className="input" type="file" id="items" />
        </form>
        <div className="innertext">Floor Plan</div>
        <form>
          <input className="input" type="file" id="floorPlan" />
        </form>
        <button className="button"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const data  = new FormData();
            data.append('name', document.getElementById('name').value)
            data.append('latitude', document.getElementById('latitude').value)
            data.append('longitude', document.getElementById('longitude').value)
            data.append('items', document.getElementById('items').value)
            data.append('floorPlan', document.getElementById('floorPlan').value)
            fetch('http://localhost:5000/'+window.localStorage.getItem("user"), {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
              },
              body: data
            }).then((response) => response.json())
            .then((responseData) => {
              console.log(responseData);
              window.location.href='/success';
              //return responseData;
            })
            .catch(error => console.warn(error));
            }}
      >Add data</button>
      </div>
    </>
  );
}

export default AddData;
