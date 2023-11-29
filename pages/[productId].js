import fs from "fs/promises";
import path from "path";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  //# If fallback is set to blocking, we don't need this check
  //# as Next JS will wait for the page to be pre-rendered on the server side
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

//-> getStaticProps lets you fetch data at build time
export async function getStaticProps(context) {
  const { params } = context;

  const productId = params.productId;
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");

  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product,
    },
  };
}

//# getStaticPaths lets you specify dynamic routes to pre-render pages based on data
export async function getStaticPaths() {
  return {
    // pre generating page thrice
    paths: [
      {
        params: { productId: "p1" },
      },
      // {
      //   params: { productId: "p2" },
      // },
      // {
      //   params: { productId: "p3" },
      // },
    ],
    //-> Setting fallback to tru allows other pages to be visited, but not pre-generated
    //? In the browser, loading of p1 is instant but p2 and p3 take time, with the "Loading..." screen briefly shown
    fallback: true,
  };
}

export default ProductDetailPage;
