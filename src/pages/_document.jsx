import Document, { Html, Head, Main, NextScript } from "next/document";

const AppConfig = {
  site_name: "React landing page",
  title: "React landing page template 2021",
  description: "Production ready plug n play landing page!",
  locale: "en",
};

class MyDocument extends Document {
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
