import { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider, PartialTheme, Stack } from '@fluentui/react';
import SideNavigation from './components/navigation/SideNavigation';
import ManageForms from './components/pages/ManageForms';
import Home from './components/pages/Home';
import ManageTemplates from './components/pages/ManageTemplates';
import TopNavigation from './components/navigation/TopNavigation';

const lightTheme: PartialTheme = {
  palette: {
    themePrimary: '#846e60',
    themeLighterAlt: '#faf8f7',
    themeLighter: '#ebe5e1',
    themeLight: '#dacfc9',
    themeTertiary: '#b6a398',
    themeSecondary: '#937e70',
    themeDarkAlt: '#776357',
    themeDark: '#65544a',
    themeDarker: '#4a3e36',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#a9b5c7',
    neutralSecondary: '#63758f',
    neutralPrimaryAlt: '#32435b',
    neutralPrimary: '#223045',
    neutralDark: '#1a2434',
    black: '#131b27',
    white: '#ffffff',
  }
};

const darkTheme: PartialTheme = {
  palette: {
    themePrimary: '#ae9e92',
    themeLighterAlt: '#070606',
    themeLighter: '#1c1917',
    themeLight: '#342f2c',
    themeTertiary: '#685f57',
    themeSecondary: '#998b80',
    themeDarkAlt: '#b6a79b',
    themeDark: '#c1b4aa',
    themeDarker: '#d1c7bf',
    neutralLighterAlt: '#253348',
    neutralLighter: '#2a394f',
    neutralLight: '#34445b',
    neutralQuaternaryAlt: '#3a4a63',
    neutralQuaternary: '#3f5069',
    neutralTertiaryAlt: '#576982',
    neutralTertiary: '#eeeeee',
    neutralSecondary: '#f1f1f1',
    neutralPrimaryAlt: '#f4f4f4',
    neutralPrimary: '#e6e6e6',
    neutralDark: '#f9f9f9',
    black: '#fcfcfc',
    white: '#1f2c40',
  }
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <Router>
        <ThemeProvider applyTo='body' theme={isDarkMode ? darkTheme : lightTheme}>
          <TopNavigation isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsSidePanelOpen={setIsOpen} />
          <SideNavigation isOpen={isOpen} setIsOpen={setIsOpen}></SideNavigation>
          <Stack
            verticalFill
            styles={{
              root: {
                margin: '0 40px',
                textAlign: 'center'
              }
            }}
            gap={15}
          >
            <Route path="/" exact component={Home} />
            <Route path="/index.html" exact component={Home} />
            <Route path="/manageforms" component={ManageForms} />
            <Route path="/managetemplates" component={ManageTemplates} />
          </Stack>
        </ThemeProvider>
      </Router>
  );
}

export default App;
