function AddData() {
  return (
    <>
      <div> {window.localStorage.getItem("user")}'s adding data. </div>
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
    </>
  );
}

export default AddData;
