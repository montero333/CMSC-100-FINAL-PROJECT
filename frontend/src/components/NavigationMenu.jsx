import React from 'react';

const NavigationMenu = ({ name, url, onClick }) => {
  return (
    <button className="nav-button" onClick={onClick}> 
      {name}
    </button>
  );
}

export default NavigationMenu;