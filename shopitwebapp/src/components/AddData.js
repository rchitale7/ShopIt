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
          <input className="input" type="file" id="items" name="items"/>
        </form>
        <div className="innertext">Floor Plan</div>
        <form>
          <input className="input" type="file" id="floorPlan" name="floorPlan"/>
        </form>
        <button className="button"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const data  = new FormData();
            data.append('name', document.getElementById('name').value)
            data.append('lat', document.getElementById('latitude').value)
            data.append('long', document.getElementById('longitude').value)
            data.append('items', document.getElementById('items').files[0])
            data.append('floorPlan', document.getElementById('floorPlan').files[0])
            fetch('http://localhost:5000/stores/'+window.localStorage.getItem("user"), {
              credentials: 'include',
              method: 'POST',
              body: data, 
              headers: {
                'Accept': 'application/json'
              }
            }).then((response) => response.json())
            .then((responseData) => {
              alert(responseData)
              window.location.href='/success';
            })
            .catch(error => console.warn(error));
            }}
      >Add data</button>
      </div>
    </>
  );
}

export default AddData;
