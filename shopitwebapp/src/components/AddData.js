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
          <input className="input" type="file" id="items" name="items" required/>
        </form>
        <div className="innertext">Floor Plan</div>
        <form>
          <input className="input" type="file" id="floorPlan" name="floorPlan"/>
        </form>
        <button className="button"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            var name = document.getElementById('name').value
            var lat = document.getElementById('latitude').value
            var long = document.getElementById('longitude').value
            var items = document.getElementById('items').value
            var floorPlan = document.getElementById('floorPlan').value
            if(name === null || name === "") {
              alert("Please input name.")
              return
            }
            if(lat === null || lat === "") {
              alert("Please input latitude.")
              return
            }
            if(long === null || long === "") {
              alert("Please input longitude.")
              return
            }
            if(items === null || items === "") {
              alert("Please input items.")
              return
            }
            if(floorPlan === null || floorPlan === "") {
              alert("Please input floor plan.")
              return
            }
            const data  = new FormData();
            data.append('name', name)
            data.append('lat', lat)
            data.append('long', long)
            data.append('items', document.getElementById('items').files[0])
            data.append('floorPlan', document.getElementById('floorPlan').files[0])
            fetch('http://localhost:5000/stores/'+window.localStorage.getItem("user"), {
              credentials: 'include',
              method: 'POST',
              body: data,
              headers: {
                'Accept': 'application/json'
              }
            }).then((response) => {
              if(!response.ok) {
                throw response.json()
              }
              return response.json()
            })
            .then((responseData) => {
              window.location.href='/success';
            })
            .catch(error => error.then(errorMsg => alert(errorMsg)));
            }}
      >Add data</button>
      </div>
    </>
  );
}

export default AddData;
