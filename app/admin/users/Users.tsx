'use client'
import { User } from '@/lib/models/UserModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useRouter } from 'next/navigation'

export default function Users() {
  const { data: users, error } = useSWR(`/api/admin/users`)
  const router = useRouter()
  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading('Deleting user...')
      const res = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('User deleted successfully', {
          id: toastId,
        })
        : toast.error(data.message, {
          id: toastId,
        })
    }
  )

  if (error) return 'An error has occurred.'
  if (!users) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-800 border-t-transparent align-[-0.125em] text-gray-800 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="pb-4 flex justify-between items-center">
        <h1 className="flex items-center text-5xl font-extrabold ">User<span className="bg-blue-100 text-blue-800 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded  ms-2">Details</span></h1>
        <Link href="/admin/users/create" className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-gray-300 rounded-full shadow-md group">
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gray-800 group-hover:translate-x-0 ease">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-blue-500 font-bold transition-all duration-300 transform group-hover:translate-x-full ease">Create</span>
          <span className="relative invisible">Create</span>
        </Link>
      </div>
      <div className="relative w-full h-full mt-4 overflow-scroll text-gray-900 bg-gray-200 shadow-md rounded-xl bg-clip-border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 border-b-2 border-gray-300">ID</th>
                <th className="p-4 border-b-2 border-gray-300">NAME</th>
                <th className="p-4 border-b-2 border-gray-300">EMAIL</th>
                <th className="p-4 border-b-2 border-gray-300">ADMIN</th>
                <th className="p-4 border-b-2 border-gray-300">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <tr key={user._id} className="even:bg-gray-150 odd:bg-white text-xl">
                  <td className="p-4 border border-gray-300">{formatId(user._id)}</td>
                  <td className="p-4 border border-gray-300">{user.name}</td>
                  <td className="p-4 border border-gray-300">{user.email}</td>
                  <td className="p-4 border border-gray-300">{user.isAdmin ? 'YES' : 'NO'}</td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex space-x-2 justify-center items-center">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md group"
                      >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-500 group-hover:translate-x-0 ease">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                        <span className="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease">Edit</span>
                        <span className="relative invisible">Edit</span>
                      </Link>
                      <button
                        onClick={() => deleteUser({ userId: user._id })}
                        className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-500 rounded-full shadow-md group"
                      >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-500 group-hover:translate-x-0 ease">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </span>
                        <span className="absolute flex items-center justify-center w-full h-full text-red-500 transition-all duration-300 transform group-hover:translate-x-full ease">Delete</span>
                        <span className="relative invisible">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
