import "../styles/globals.css";
//import type { AppProps } from 'next/app'

//function MyApp({ Component, pageProps }: AppProps) {
//return <Component {...pageProps} />
//}

//export default MyApp

// pages/_app.tsx
// pages/_app.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app"; // Import AppProps type
import Loader from "../components/Loader";

function MyApp({ Component, pageProps }: AppProps) {
  // Add type annotation here
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {isLoading && <Loader />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
