import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { HomeIcon,ProductsIcon,CategoriesIcon,OrdersIcon,SettingsIcon,LogoutIcon, AdminIcon } from "@/utils/Icons"
import Logo from "./Logo"

export default function Nav ({show}) {

const inactiveLink = 'flex gap-1 p-1'
const activeLink = inactiveLink+' bg-highlight text-black rounded-sm'

const router = useRouter()
const {pathname} = router

async function logout() {
    await router.push('/')
    await signOut()
}



    return (
        <aside className={(show? 'left-0' : '-left-full') + " text-gray-600 p-4 fixed w-full bg-bgGray h-full sm:static sm:w-auto transition-all"}>
            <div className="mb-4 mr-4 hidden sm:block">
                <Logo />
            </div>
            <nav className="flex flex-col gap-2">
                <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}><HomeIcon/>Dashboard</Link>
                <Link href={'/products'} className={pathname.includes("/products") ? activeLink : inactiveLink}><ProductsIcon />Products</Link>
                <Link href={'/categories'} className={pathname.includes("/categories") ? activeLink : inactiveLink}><CategoriesIcon/>Categories</Link>
                <Link href={'/orders'} className={pathname.includes("/orders") ? activeLink : inactiveLink}><OrdersIcon/>Orders</Link>
                <Link href={'/admins'} className={pathname.includes("/admins") ? activeLink : inactiveLink}><AdminIcon/>Admins</Link>
                <Link href={'/settings'} className={pathname.includes("/settings") ? activeLink : inactiveLink}><SettingsIcon/>Settings</Link>
                <button 
                    className={inactiveLink}
                    onClick={() => logout()}
                >
                    <LogoutIcon/>
                    Logout
                </button>
            </nav>
        </aside>
  )
}
