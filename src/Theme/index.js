import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components'
import { useColor } from '../contexts/Application'
import { useDarkModeManager } from '../contexts/LocalStorage'
import styled from 'styled-components'

export default function ThemeProvider({ children }) {
  const [darkMode] = useDarkModeManager()
  const [color] = useColor()

  return <StyledComponentsThemeProvider theme={theme(darkMode, color)}>{children}</StyledComponentsThemeProvider>
}

const theme = (darkMode, color) => ({
  background: darkMode
    ? 'black'
    : `linear-gradient(
      180deg,
      rgb(255, 0, 122, 0.6) 0%,
      rgb(255, 0, 122, 0) 100%
    );`,

  customColor: color,
  textColor: darkMode ? color : 'black',

  panelColor: darkMode ? color : 'rgba(255, 255, 255, 0.4)',
  backgroundColor: darkMode ? 'black' : 'white',

  uniswapPink: darkMode ? '#ff007a' : 'black',

  concreteGray: darkMode ? '#292C2F' : '#FAFAFA',
  inputBackground: darkMode ? '#1F1F1F' : 'rgba(255, 255, 255, 0.4)',
  shadowColor: darkMode ? '#000' : '#2F80ED',
  mercuryGray: darkMode ? '#333333' : '#E1E1E1',

  text1: darkMode ? '#FFFFFF' : '#000000',
  text2: darkMode ? '#888D9B' : '#565A69',
  text3: darkMode ? '#6C7284' : '#888D9B',
  text4: '#C3C5CB',
  text5: '#EDEEF2',

  // backgrounds / greys
  bg1: darkMode ? '#191B1F' : '#FFFFFF',
  bg2: darkMode ? '#2C2F36' : '#F7F8FA',
  bg3: darkMode ? '#40444F' : '#EDEEF2',
  bg4: darkMode ? '#565A69' : '#CED0D9',
  bg5: darkMode ? '#565A69' : '#888D9B',

  //blues
  // blue1: '#2172E5',
  blue1: '#ff007a',
  blue2: darkMode ? '#3680E7' : '#1966D2',
  blue3: darkMode ? '#4D8FEA' : '#165BBB',
  // blue5: '#EBF4FF',
  // blue4: '#C4D9F8',
  blue4: '#F6DDE8',
  blue5: '#FDEAF1',

  // pinks
  pink1: '#DC6BE5',
  pink2: '#ff007a',

  // other
  red1: '#FF6871',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E'
})

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer'
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.blue1};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  html { font-family: 'Inter', sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }
  
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;    
  }

  body > div {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  } 

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }

  html {
    font-size: 16px;
    font-variant: none;
    color: 'black';
    background-color: ${({ theme }) => theme.backgroundColor};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
`
