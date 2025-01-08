// App.jsx
import React from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import './index.css'; 


const App = () => {
  return (
    <div className="font-sans">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default App;
