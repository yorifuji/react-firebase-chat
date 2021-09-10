import React from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import blue from '@material-ui/core/colors/blue'
import ResponsiveDrawer from './components/ResponsiveDrawer'
import { BrowserRouter } from 'react-router-dom'

function App(): JSX.Element {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: blue,
        },
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ResponsiveDrawer />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
