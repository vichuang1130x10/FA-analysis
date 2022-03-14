import { Router } from "@reach/router";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

import Landing from "./PageComponent/Landing";
import Dashboard from "./PageComponent/Dashboard";
import Details from "./PageComponent/Details";
import Monitoring from "./PageComponent/Monitoring";

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Landing path="/" />
        <Dashboard path="dashboard" />
        <Details path="details" />
        <Monitoring path="monitoring" />
      </Router>
      <Footer />
    </div>
  );
}

export default App;
