// Client Side data fetching

import { useEffect, useState } from "react";
import useSWR from "swr";

function LastSalesPage() {
  const [sales, setSales] = useState();
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

  if (!data || !sales) {
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

export default LastSalesPage;
