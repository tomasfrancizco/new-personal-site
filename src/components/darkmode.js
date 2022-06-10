import React from 'react';
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import sun from '../images/sun.png';
import moon from '../images/moon.png';

const DarkMode = () => {

  return(
    <div id="toggle-main-container" >
      <ThemeToggler>
        {({ theme, toggleTheme }) => {
          return (
            <div>
              <div id="toggle-container" onClick={() => {
                toggleTheme(theme === "light" ? "dark" : "light")
              }}>
                  <img src={sun} className="theme-img" id="sun" />
                  <img src={moon} className="theme-img" id="moon" />
                  <div id="ball" className="light-theme"></div>
              </div>
            </div>
          )
        }}
      </ThemeToggler>
    </div>
  )
}

export default DarkMode