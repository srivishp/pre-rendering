// importing file system module from Node JS. It is a global object by Node JS.
//This will not be visible on client side
//* It is supposed to be used in the server side
import fs from "fs/promises";
import Link from "next/link";
import path from "path";

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// Code written inside getStaticProps() will not be executed on client side
export async function getStaticProps(context) {
  // context contains the data we want to show
  // process object is a global object by Node JS
  //-> cwd = current working directory
  //* Gives the cwd of this file when it is executed
  //# cwd will be the root(main project folder) but not the pages folder

  const filePath = path.join(process.cwd(), "data", "dummy-backend.js");
  const jsonData = await fs.readFile(filePath);
  // parse json into a regular object
  const data = JSON.parse(jsonData);

  // redirecting when there is no data
  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  // condition for product not found
  if (data.products.length === 0) {
    return { notFound: true };
  }
  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}

export default HomePage;
