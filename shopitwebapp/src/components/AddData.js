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
          <form>
            <input className="input" type="text" id="name" placeholder="name..."/>
          </form>
          <form>
            <input className="input" type="text" id="address" placeholder="address..." value={this.state.value} onInput={this.onChangeDestination}/>
          </form>
          <div className="autocomplete" id="autocomplete">{suggestionsList}</div>
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
  
}

export default AddData;
