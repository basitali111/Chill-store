import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Forgot Password',
}

export default async function Register() {
  return <Form />
}
