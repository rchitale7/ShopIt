import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function AddData() {
  return (
    <>
      <div> add data page! </div>
      <form>
        <input type="text" id="name" placeholder="name..."/>
      </form>
      <form>
        <input type="text" id="latitude" placeholder="latitude..."/>
      </form>
      <form>
        <input type="text" id="longitude" placeholder="longitude..."/>
      </form>
      <form>
        <input type="file" id="items" />
      </form>
      <form>
        <input type="file" id="floorPlan" />
      </form>
      <button
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
    </>
  );
}

export default AddData;
