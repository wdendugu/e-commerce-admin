import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav"
import { MenuIcon } from "@/utils/Icons"
import { useState } from "react"
import Logo from "./Logo"

export default function Layout({children}) {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()
  console.log(showNav)
    if (!session) {
      return (
        <div className='bg-bgGray w-screen h-screen flex items-center'>
          <div className='text-center w-full'>
            <button 
              className='bg-white p-2 px-4 rounded-lg' 
              onClick={() => signIn("google")}>
                Login w Google
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-bgGray min-h-screen">
        <div className="sm:hidden flex items-center p-4">
          <button onClick={() => setShowNav(true)}>
            <MenuIcon/>
          </button>
          <div className="flex grow justify-center mr-6">
            <Logo />
          </div>
        </div>
        <div className="bg-bgGray min-h-screen flex">
          <Nav show={showNav}/>
          <div className="flex-grow p-4">
            {children}
          </div>
        </div>
      </div>
        
      )
}
