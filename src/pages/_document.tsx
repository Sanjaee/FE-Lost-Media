import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link rel="icon" href="/bg.png" />
        <meta
          name="description"
          content="Lost Media - Discover and discuss lost media"
        />
        <meta property="og:image" content="/bg.png" />
        <meta property="og:title" content="LostMedia" />
        <meta
          property="og:description"
          content="Discover and discuss lost media"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/bg.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
