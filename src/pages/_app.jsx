import Aos from 'aos';
import { useEffect } from 'react';
import '../styles/index.scss';
import "react-toastify/dist/ReactToastify.css";
import dynamic from 'next/dynamic'
import ContextProvider from '../Context/ContextProvider';
import { Analytics } from '@vercel/analytics/react';

const AnimatedCursor = dynamic(() => import('react-animated-cursor'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
    });
  }, []);
  return (
    <>
      <AnimatedCursor
        innerSize={8}
        outerSize={34}
        trailingSpeed={4}
        color="255, 160, 1"
        outerAlpha={0.3}
        innerScale={0.7}
        outerScale={1.3}
      />

      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>

      <Analytics />
    </>
  )
}

export default MyApp
