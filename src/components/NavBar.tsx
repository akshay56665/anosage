'use client'
import { User } from 'next-auth'
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'

const NavBar = () => {
  const {data:session}=useSession()
  const user:User=session?.user as User
    
  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container flex flex-col md:flex-row justify-between items-center'>
        <a href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</a>
        {
          session?(
            <>
              <span>Welcome, {user.username||user.email}</span>
              <Button onClick={()=>signOut()}>Logout</Button>
            </>
          ):(
            <Link href={'/signin'} >
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )
        }
      </div>
    </nav>
  )
}

export default NavBar
