import { Metadata } from 'next'
import ReviewHistoryPage from './Review-History'

export const metadata: Metadata = {
  title: ' Products Review',
}

export default async function PaymentPage() {
  return <ReviewHistoryPage/>
}
