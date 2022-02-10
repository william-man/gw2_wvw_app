import Layout from "../components/layout_components/layout";
import "../styles/components/layout_scss/_header.scss";
import "../styles/components/layout_scss/_footer.scss";
import "../styles/components/layout_scss/_content.scss";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
