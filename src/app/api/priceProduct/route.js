import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const productId = process.env.LEMON_PRODUCT_ID; // Get product ID from environment variable
    const response = await axios.get(
      `https://api.lemonsqueezy.com/v1/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
          Accept: "application/vnd.api+json",
        },
      }
    );

    const product = response.data.data;

    // Return product details
    return NextResponse.json({
      name: product.attributes.name,
      price: product.attributes.price / 100, // Convert cents to dollars
      buy_now_url: product.attributes.buy_now_url,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch product details", error: error.message },
      { status: 500 }
    );
  }
}
