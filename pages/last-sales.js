// Client Side data fetching

import { useEffect, useState } from "react";
import useSWR from "swr";

function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales);
  // const [isLoading, setIsLoading] = useState(false);

  //-> Stale While Revalidate
  //# Cache Invalidation Strategy
  // SWR is a strategy to first return the data from cache (stale),
  // then send the fetch request (revalidate),
  // and finally come with the up-to-date data.
  //? https://swr.vercel.app/

  const { data, error } = useSWR(
    "https://client-side-fetching-nextjs-default-rtdb.asia-southeast1.firebasedatabase.app/sales.json",
    (url) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          item: data[key].item,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);
  //   useEffect(() => {
  //     setIsLoading(true);
  //     fetch(
  //       "https://client-side-fetching-nextjs-default-rtdb.asia-southeast1.firebasedatabase.app/sales.json"
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const transformedSales = [];

  //         for (const key in data) {
  //           transformedSales.push({
  //             id: key,
  //             username: data[key].username,
  //             item: data[key].item,
  //             volume: data[key].volume,
  //           });
  //         }

  //         setSales(transformedSales);
  //         setIsLoading(false);
  //       });
  //   }, []);

  if (error) {
    return <p>Failed to load</p>;
  }

  if (!data && !sales) {
    return <p>Loading...</p>;
  }

  //   if (!sales) {
  //     return <p>No data yet</p>;
  //   }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - {sale.item} - {sale.volume} units
        </li>
      ))}
    </ul>
  );
}

//* Using both Client Side and Server Side data fetching
// We can't use SWR because this is not a react component
// React hooks can only be used in components
export async function getStaticProps() {
  const response = await fetch(
    "https://client-side-fetching-nextjs-default-rtdb.asia-southeast1.firebasedatabase.app/sales.json"
  );
  const data = await response.json();
  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      item: data[key].item,
      volume: data[key].volume,
    });
  }

  return { props: { sales: transformedSales }, revalidate: 10 };
}

export default LastSalesPage;
