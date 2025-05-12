import Link from 'next/link'
import { createClient } from '../../supabase/server'
import { Button } from './ui/button'
import { User, UserCircle } from 'lucide-react'
import UserProfile from './user-profile'

export default async function Navbar() {
  const supabase = createClient()

  const { data: { user } } = await (await supabase).auth.getUser()


  return (
    <nav className="hidden w-full border-b border-gray-200 bg-white py-2">
  <div className="container mx-auto px-4 flex items-center justify-between relative">
    <div className="flex-1 flex justify-center absolute left-0 right-0 pointer-events-none">
      <Link href="/" prefetch className="text-xl font-bold pointer-events-auto">
        FoodAI
      </Link>
    </div>
    <div className="flex gap-4 items-center ml-auto relative z-10">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>
                  Dashboard
                </Button>
              </Link>
              <UserProfile  />
            </>
          ) : (
            <>
              {/* <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link> */}
              {/* <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              >
                Sign Up
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
