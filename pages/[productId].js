import fs from "fs/promises";
import path from "path";

function ProdcutDetailPage() {
  const { loadedProduct } = props;

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
  const filePath = path.join(process.cwd(), "data", "dummy-backend.js");

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
      {
        params: { productId: "p2" },
      },
      {
        params: { productId: "p3" },
      },
    ],
  };
}

export default ProdcutDetailPage;
