import React , {useContext, useEffect, useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import "antd/dist/antd.css";
import "font-awesome/css/font-awesome.min.css";
import Footer from "./components/Footer/Footer";
const App = () => {
 
  return (
    <>
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>

    </Router>
</>
  );
};

export default App;














