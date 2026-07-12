import { Html, Head, Main, NextScript } from 'next/document';
import { poppins, openSans } from '../styles/fonts';

export default function Document() {
  return (
    <Html lang="en" className={`${poppins.variable} ${openSans.variable}`}>
      <Head>
        <link rel="preconnect" href="https://api.rss2json.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
