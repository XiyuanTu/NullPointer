import "../styles/globals.css";
import Navbar from "../components/Navbar";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import { Divider } from "@mui/material";
import theme from "../styles/theme";
import { store } from "../state/store";
import { Provider } from "react-redux";
import { Feedback} from '../components/Feedback'


function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Provider store={store}>
          <Navbar/>
          <Divider sx={{ height: "1vh", position: 'fixed', width: '100vw', top: '8vh', left: 0, bgcolor: '#ffffff', zIndex: 999}} />
          <Component {...pageProps}/>
          <Feedback/>
        </Provider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
