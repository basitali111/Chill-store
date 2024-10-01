'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useState } from 'react'

export const SearchBox = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'

  const { data: categories, error } = useSWR('/api/products/categories')

  if (error) return error.message
  if (!categories) return 'Loading...'

  const handleCategoryChange = (c: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('category', c)
    router.push(`/search?${newSearchParams.toString()}`)
    setDropdownOpen(false)
  }

  return (
    <form action="/search" method="GET" className="max-w-lg  sm:w-full md:mt-1 lg:mt-1 flex justify-center mt-[-10px]">
      <div className="flex relative lg:w-[80%] ">
        <button 
          id="dropdown-button" 
          type="button"
          className="flex-shrink-0 mt-2 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100    " 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {category}
          <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
        {dropdownOpen && (
          <div id="dropdown" className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-56  mt-11 mr-5 mt-2 " >
            <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdown-button">
              <li>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 "
                  onClick={() => handleCategoryChange('All')}
                >
                  All
                </button>
              </li>
              {categories.map((c: string) => (
                <li key={c}>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100  "
                    onClick={() => handleCategoryChange(c)}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="relative w-full mt-2">
          <input 
            type="search" 
            id="search-dropdown" 
            placeholder="Search Your Product..."
            defaultValue={q}
            name="q" 
            className="block pt-2.5  pb-2.5  pr-2.5 pl-2.5 lg:pr-48  lg:pl-4 z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500    max-w-full" 
            required 
          />
          <button 
            type="submit" 
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  "
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  )
}
