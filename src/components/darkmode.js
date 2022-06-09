import React, { useState, useEffect } from 'react';
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { CSSTransition } from 'react-transition-group';

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