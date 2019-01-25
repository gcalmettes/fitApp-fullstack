import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import yellow from '@material-ui/core/colors/yellow';


const baseTheme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: yellow
  },
  typography: {
    useNextVariants: true,
    // fontFamily: 'sans-serif',
  },
})
export { baseTheme as theme }

export const addToTheme = (customStyles, theme=baseTheme) => {
  return Object.assign(customStyles, theme)
} 