import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header";
import TrackNetWorth from "./components/TrackNetWorth";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Header />
      <TrackNetWorth />
      <Footer />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
