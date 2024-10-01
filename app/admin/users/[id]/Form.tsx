'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { User } from '@/lib/models/UserModel'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function UserCreateForm() {
  const router = useRouter()
  const { trigger: createUser, isMutating: isCreating } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: User }) => {
      const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('User created successfully')
      router.push('/admin/users')
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()

  const formSubmit = async (formData: User) => {
    await createUser(formData)
  }

  return (
    <div>
      <h1 className="text-2xl py-4">Create User</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="md:flex my-3">
            <label className="label md:w-1/5" htmlFor="name">Name</label>
            <div className="md:w-4/5">
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="input input-bordered w-full max-w-md"
              />
              {errors.name?.message && (
                <div className="text-error">{errors.name.message}</div>
              )}
            </div>
          </div>
          <div className="md:flex my-3">
            <label className="label md:w-1/5" htmlFor="email">Email</label>
            <div className="md:w-4/5">
              <input
                type="email"
                id="email"
                {...register('email', { required: 'Email is required' })}
                className="input input-bordered w-full max-w-md"
              />
              {errors.email?.message && (
                <div className="text-error">{errors.email.message}</div>
              )}
            </div>
          </div>
          <div className="md:flex my-3">
            <label className="label md:w-1/5" htmlFor="isAdmin">Admin</label>
            <div className="md:w-4/5">
              <input
                id="isAdmin"
                type="checkbox"
                className="toggle"
                {...register('isAdmin')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="btn bg-gray-800 text-white  hover:bg-gray-500"
          >
            {isCreating && <span className="loading loading-spinner"></span>}
            Create
          </button>
          <Link className="btn ml-4" href="/admin/users">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}
