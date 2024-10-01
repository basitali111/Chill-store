// app/(front)/page.tsx
import { Product } from '@/lib/models/ProductModel';
import productService from '@/lib/services/productService';
import ClientComponent from './ClientComponent';

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Kensin Store',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Nextjs, Server components, Next auth, daisyui, zustand',
};

export default async function Home() {
  const featuredProducts: Product[] = await productService.getFeatured();
  const latestProducts: Product[] = await productService.getLatest();
  const categoriesWithImages = await productService.getCategoriesWithImages();
  return <ClientComponent  latestProducts={latestProducts}  categoriesWithImages={categoriesWithImages} />;
}
//return <ClientComponent featuredProducts={featuredProducts} latestProducts={latestProducts}  categoriesWithImages={categoriesWithImages} />;
