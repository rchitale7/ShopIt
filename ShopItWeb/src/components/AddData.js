import React from 'react';
import Logo from '../assets/logo_filled.png';
import ReactTooltip from 'react-tooltip';
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
        <img src={Logo} className="img" alt="ShopIt" />
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
          <div className="innertext">Inventory
            <img data-tip data-for="inventoryTip" src="https://www.freeiconspng.com/uploads/information-icon-3.png" className="info"/>
          </div>
          <ReactTooltip id="inventoryTip" place="bottom">
            All items in csv file must contain values for columns: name, brand, category, price, size.
          </ReactTooltip>
          <form>
            <input className="input" type="file" id="items" name="items" accept=".csv"/>
            <div className="filetext">Accepted file types: .csv</div>
          </form>
          <div className="innertext">Floor Plan
          <img data-tip data-for="planTip" src="https://www.freeiconspng.com/uploads/information-icon-3.png" className="info"/>
          </div>
          <ReactTooltip id="planTip" place="bottom">
            Note: some floor plan images that are too small might not render correctly.
          </ReactTooltip>
          <form>
            <input className="input" type="file" id="floorPlan" name="floorPlan" accept=".png, .jpg, .jpeg"/>
            <div className="filetext">Accepted file types: .jpg, .jpeg, .png</div>
          </form>
          <div className="innertext">Images
            <img data-tip data-for="imagesTip" src="https://www.freeiconspng.com/uploads/information-icon-3.png" className="info"/>
          </div>
          <ReactTooltip id="imagesTip" place="bottom">
            The name of each image in the zip file must match the name of the item you want it to be associated with.
          </ReactTooltip>
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
                if(name === null || name === "") {
                  alert("Please input name.")
                  return
                }
                if(addr === null || addr === "") {
                  alert("Please input address.")
                  return
                }
                const data  = new FormData();
                data.append('name', name)
                data.append('address', addr)
                data.append('items', document.getElementById('items').files[0])
                data.append('floorPlan', document.getElementById('floorPlan').files[0])
                data.append('images', document.getElementById('images').files[0])
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
                      window.localStorage.setItem("items", getResponseData.items)
                      window.localStorage.setItem("floorPlan", getResponseData.floorPlan)
                      window.localStorage.setItem("storeId", getResponseData.storeId)
                    }
                    else {
                      window.localStorage.setItem("name", null)
                      window.localStorage.setItem("address", null)
                      window.localStorage.setItem("items", [])
                      window.localStorage.setItem("storeId", getResponseData.storeId)
                    }
                    window.location.href='/dragAndDrop';
                  })
                  .catch(error => {
                  })
                })
                .catch(error => error.then(errorMsg => alert(errorMsg.msg)));
                }}
          >Edit Map</button>
          <button className="button"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              var name = document.getElementById('name').value
              var addr = document.getElementById('address').value
              if(name === null || name === "") {
                alert("Please input name.")
                return
              }
              if(addr === null || addr === "") {
                alert("Please input address.")
                return
              }
              const data  = new FormData();
              data.append('name', name)
              data.append('address', addr)
              data.append('items', document.getElementById('items').files[0])
              data.append('floorPlan', document.getElementById('floorPlan').files[0])
              data.append('images', document.getElementById('images').files[0])
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
        >Done!</button>
        </div>
      </>
    );
  }

}

export default AddData;
