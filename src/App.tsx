import React from "react";
import Header from "./components/layout/Header";
import RouterOutlet from "./components/layout/RouterOutlet";

const App = () => {
  return (
    <div>
      <Header />
      <RouterOutlet />
    </div>
  );
};

export default App;
