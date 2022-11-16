import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return width;
};

export const useWindowHeight = () => {
  const [height, setHeight] = useState(0);

  const handleWindowResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return height;
};

export const useIsRouterChanging = () => {
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsChanging(true);
    };
    const handleStop = () => {
      setIsChanging(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return isChanging;
};