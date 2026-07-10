import { redirect } from "next/navigation";
import { PRODUCTS } from "@/lib/mock-data";

function Product() {
  redirect(`/product/${PRODUCTS[0].id}`);
}

export default Product;
