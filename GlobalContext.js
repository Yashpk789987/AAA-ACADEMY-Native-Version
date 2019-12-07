import React from 'react';

export const themes = {
  light: {
    name: 'light',
    background: '#eeeeee',
    header_background_color: '#0037a0',
    spinner_color: '#0037a0',
    button_background_color: '#0037a0',
    text_color: 'black',
    outline_color: '#0037a0'
  },
  dark: {
    name: 'dark',
    background: '#1B1B22',
    header_background_color: '#323232',
    spinner_color: 'white',
    button_background_color: '#323232',
    text_color: 'white',
    outline_color: 'white'
  }
};

export const ThemeContext = React.createContext(themes.dark);

export const GlobalContext = React.createContext({
  demo: 'demo_value',
  theme_color: '#1B1B22',
  home_container_reference: null,
  drawer_reference: null
});
