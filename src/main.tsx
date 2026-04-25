import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App.tsx'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
)
