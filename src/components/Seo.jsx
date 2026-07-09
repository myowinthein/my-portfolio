import Head from "next/head";
import { position, metaTitle, metaDescription, metaImage, siteURL, firstName, lastName, linkedinURL, githubURL, mediumURL } from "../config";

const personSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": `${firstName} ${lastName}`,
  "jobTitle": position,
  "url": siteURL,
  "sameAs": [linkedinURL, githubURL, mediumURL],
});

const SEO = ({ pageTitle }) => (
  <Head>
    <title>{pageTitle ? `${pageTitle} | ${position}` : metaTitle}</title>

    {/* Primary Meta Tags */}
    <meta name="description" content={metaDescription} />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="canonical" href={siteURL} />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={siteURL} />
    <meta property="og:title" content={metaTitle} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:image" content={metaImage} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:url" content={siteURL} />
    <meta name="twitter:title" content={metaTitle} />
    <meta name="twitter:description" content={metaDescription} />
    <meta name="twitter:image" content={metaImage} />

    {/* Structured Data */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />

    {/* Favicon */}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </Head>
);

export default SEO;