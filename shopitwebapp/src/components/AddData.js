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
              var name = document.getElementById('name').value
              var latitude = document.getElementById('latitude').value
              var longitude = document.getElementById('longitude').value
              var items = document.getElementById('items').value
              var floorPlan = document.getElementById('floorPlan').value
              window.location.href='/success';
              }}
        >Add data</button>
      </div>
    </>
  );
}

export default AddData;
