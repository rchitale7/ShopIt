import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function AddData() {
  return (
    <>
      <div> add data page! </div>
      <li>
        <Link to="/success">Success</Link>
      </li>
    </>
  );
}

export default AddData;
