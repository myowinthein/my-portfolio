import Head from "next/head";
import { metaTitle, metaDescription, metaImage, siteURL } from "../config";

const SEO = ({ pageTitle }) => (
  <>
    <Head>
      <title>
        {pageTitle && `${pageTitle} - My Journey`}
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
      <link rel="icon" href="/favicon.ico" />
    </Head>
  </>
);

export default SEO;