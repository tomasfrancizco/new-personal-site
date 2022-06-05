import React, { useState, useEffect } from 'react';
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

const DarkMode = () => {

  const [darkTheme, setDarkTheme] = useState(null)

  useEffect(() => {
    const theme = window.document.body.getAttribute("class");
    theme == "dark" ? setDarkTheme("light-theme") : setDarkTheme("dark-theme")
  }, [])

  return(
    <div id="toggle-main-container" >
      <ThemeToggler>
        {({ theme, toggleTheme }) => {
          return (
            <div>
              <div id="toggle-container" onClick={() => {
                setDarkTheme(darkTheme == "light-theme" ? "dark-theme" : "light-theme")
                toggleTheme(theme == "light" ? "dark" : "light")
              }}>
                <div id="ball" className={darkTheme}></div>
              </div>
            </div>
          )
        }}
      </ThemeToggler>
    </div>
  )
}

export default DarkMode