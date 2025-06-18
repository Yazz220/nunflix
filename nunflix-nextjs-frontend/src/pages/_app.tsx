import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import GlobalErrorDisplay from "@/components/GlobalErrorDisplay/GlobalErrorDisplay"; // Import GlobalErrorDisplay
import React, { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
      <GlobalErrorDisplay /> {/* Add the error display component here */}
    </QueryClientProvider>
  );
}
