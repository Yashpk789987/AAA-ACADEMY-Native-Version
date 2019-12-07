import React from 'react';

import MainComponent from './components/MainComponent';

import { themes, ThemeContext } from './GlobalContext';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.dark
    };
  }

  componentDidMount = async () => {};

  componentDidUpdate() {}

  toggleTheme = () => {
    this.setState(state => ({
      theme: state.theme === themes.dark ? themes.light : themes.dark
    }));
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <MainComponent toggleTheme={this.toggleTheme} />
      </ThemeContext.Provider>
    );
  }
}