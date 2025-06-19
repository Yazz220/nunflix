import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
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
      <Head>
        <title>Nunflix</title>
        <meta name="description" content="Nunflix - Watch Movies & TV Shows Online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=YOUR_TRACKING_ID"
      />
      <Script
        id="gtag-inline-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_TRACKING_ID');
          `,
        }}
      />
      <Header />
      <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
      <GlobalErrorDisplay /> {/* Add the error display component here */}
    </QueryClientProvider>
  );
}
