// WrapperComponent.js

import React from 'react';
import Navbar from "./layout/Navbar";

const WrapperComponent = ({ showNavbar, children }) => {
  return (
    <div>
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};

export default WrapperComponent;
