import { Metadata } from 'next';
import productService from '@/lib/services/productService';
import ProductDetails from '@/components/ProductDetails';
import { Product } from '@/lib/models/ProductModel';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await productService.getBySlug(params.slug);
  if (!product) {
    return {
      title: 'Product not found',
    };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await productService.getBySlug(params.slug);
  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={product} />;
}

