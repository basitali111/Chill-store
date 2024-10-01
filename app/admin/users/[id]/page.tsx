import AdminLayout from '@/components/admin/AdminLayout'
import UserCreateForm from './Form'

export const metadata = {
  title: 'Create User',
}

export default function UserCreatePage() {
  return (
    <AdminLayout activeItem="users">
      <UserCreateForm />
    </AdminLayout>
  )
}
