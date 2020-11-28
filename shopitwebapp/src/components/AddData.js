import React from 'react';
import logo from './logo_filled.png';
const API_KEY='AIzaSyB0OBBZB0abirvfDAjbAWbCeGqk-knKvtw';

class AddData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      predictions: [],
    };

    this.onChangeDestination = this.onChangeDestination.bind(this);
  }

  onChangeDestination(event) {
    document.getElementById("autocomplete").style.display = 'block';
    this.setState({value: event.target.value});

    const autocompleteUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${event.target.value}&key=${API_KEY}`;

    fetch(autocompleteUrl)
    .then(res => {
        return res.json()
    })
    .then(res => {
        this.setState({predictions: res.predictions});
    })
    .catch(error => {
        console.log(error);
    });
  }

  render() {
    const suggestionsList = this.state.predictions.map((prediction) => <button
      className="suggestion"
      key={prediction.description}
      onClick={(e) => {
        document.getElementById("address").value = e.target.innerText
        document.getElementById("autocomplete").style.display = 'none';
      }}
      >{prediction.description}</button>);
    return (
      <>
        <img src={logo} className="img" />
        <div className="header">Update store data!</div>
        <div className="datacontainer">
          <div className="innertext">Name</div>
          <form>
            <input className="input" type="text" id="name" placeholder="name..." defaultValue={window.localStorage.getItem("name")}/>
          </form>
          <div className="innertext">Address</div>
          <form>
            <input className="input" type="text" id="address" placeholder="address..." defaultValue={window.localStorage.getItem("address")} onInput={this.onChangeDestination}/>
          </form>
          <div className="autocomplete" id="autocomplete">{suggestionsList}</div>
          <div className="innertext">Inventory</div>
          <form>
            <input className="input" type="file" id="items" name="items" accept=".csv"/>
            <div className="filetext">Accepted file types: .csv</div>
          </form>
          <div className="innertext">Floor Plan</div>
          <form>
            <input className="input" type="file" id="floorPlan" name="floorPlan" accept=".png, .jpg, .jpeg"/>
            <div className="filetext">Accepted file types: .jpg, .jpeg, .png</div>
          </form>
          <div className="innertext">Images</div>
          <form>
            <input className="input" type="file" id="images" name="images" accept=".zip"/>
            <div className="filetext">Accepted file types: .zip</div>
          </form>
          <button className="button"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              var name = document.getElementById('name').value
              var addr = document.getElementById('address').value
              var items = document.getElementById('items').value
              var floorPlan = document.getElementById('floorPlan').value
              var images = document.getElementById('images').value
              if(name === null || name === "") {
                alert("Please input name.")
                return
              }
              if(addr === null || addr === "") {
                alert("Please input address.")
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
              if(images === null || images === "") {
                alert("Please input images.")
                return
              }
              const data  = new FormData();
              data.append('name', name)
              data.append('address', addr)
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
              .catch(error => error.then(errorMsg => alert(errorMsg.msg)));
              }}
        >Add data</button>
        </div>
      </>
    );
  }

}

export default AddData;
