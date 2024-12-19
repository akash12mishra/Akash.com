"use client";

import React, { useEffect, useState } from "react";
import axios from "../../../axios/api";

const Price = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("priceProduct");
        const data = await response.data;
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  console.log("product", product);

  const handleSubscribe = () => {
    if (product) {
      window.location.href = product.buy_now_url;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not available</p>;

  return (
    <div>
      <h3>Pay ${product.price} Monthly</h3>
      <button onClick={handleSubscribe}>Pay Now</button>
    </div>
  );
};

export default Price;
