import fs from "fs/promises";
import path from "path";

function ProductDetailPage(props) {
  const { loadedProduct } = props;
  /*
# If fallback is set to blocking, we don't need this check
# as Next JS will wait for the page to be pre-rendered on the server side

? This is quite similar to fallback: true, except that it does not return the dummy loading page when a page that hasn't been cached is hit for the first time
? Instead, it just makes the browser hang, until the page is rendered for the first time.
? Future requests to that page are quickly served from the cache however, just like fallback: true.
*/

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");

  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

//-> getStaticProps lets you fetch data at build time
export async function getStaticProps(context) {
  const { params } = context;

  const productId = params.productId;

  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

//# getStaticPaths lets you specify dynamic routes to pre-render pages based on data
export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((product) => product.id);

  // ({}) because we are doing an inline return, and not creating a function body
  const pathsWithParams = ids.map((id) => ({ params: { productId: id } }));

  return {
    // pre generating all pages
    paths: pathsWithParams,

    //-> Setting fallback to true allows other pages to be visited, but not pre-generated
    //? In the browser, loading of p1 is instant but p2 and p3 take time, with the "Loading..." screen briefly shown
    fallback: true,
  };
}

export default ProductDetailPage;
