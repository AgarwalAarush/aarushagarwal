import { Html, Head, Main, NextScript } from "next/document";
import {
  getMetadataImageAbsoluteUrl,
  SITE_METADATA_LOGO_PATH,
} from "../lib/assets";

export default function Document() {
  const ogImageUrl = getMetadataImageAbsoluteUrl();

  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href={SITE_METADATA_LOGO_PATH} type="image/png" />
        <link rel="apple-touch-icon" href={SITE_METADATA_LOGO_PATH} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
