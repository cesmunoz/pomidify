import "../styles/globals.css";
import "ui/styles.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";

import { AppProvider } from "../context/app";
import { ThemeProvider } from "ui";
import Layout2 from "../components/Layout2";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    // <ChakraProvider>
    //   <SessionProvider session={session}>
    // <AppProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout2>
        <Component {...pageProps} />
      </Layout2>
    </ThemeProvider>
    //     </AppProvider>
    //   </SessionProvider>
    // </ChakraProvider>
  );
}

export default MyApp;
