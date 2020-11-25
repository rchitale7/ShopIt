import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function AddData() {
  return (
    <>
      <div> add data page! </div>
      <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            window.location.href='/success';
            }}
      >Add data</button>
    </>
  );
}

export default AddData;
