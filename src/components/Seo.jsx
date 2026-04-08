import Head from "next/head";
import { position, metaTitle, metaDescription, metaImage, siteURL } from "../config";

const SEO = ({ pageTitle }) => (
  <>
    <Head>
      <title>
        {pageTitle && `${pageTitle} | ${position}`}
      </title>

      {/* Primary Meta Tags */}
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="noindex, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteURL} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image"/>
      <meta property="twitter:url" content={siteURL} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="%PUBLIC_URL%/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon.svg" />
      <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png" />
      <link rel="manifest" href="%PUBLIC_URL%/site.webmanifest" />
    </Head>
  </>
);

export default SEO;