import { Metadata } from 'next'
import ProductsToReviewPage from './Products-To-Review'

export const metadata: Metadata = {
  title: ' Products Review',
}

export default async function PaymentPage() {
  return <ProductsToReviewPage/>
}
