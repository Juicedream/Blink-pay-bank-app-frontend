import Link from "next/link"
import Logo from "./resusable/Logo"

const Navbar = () => {
  return (
    <div>
        <header className="w-full border-b rounded-b-md">
            <nav className="w-[98%] lg:w-[80%] mx-auto flex items-center justify-between">
                <Logo/>
                <ul className="flex items-center justify-center gap-x-2">
                    <li>
                        <Link href={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link href={"/services"}>Services</Link>
                    </li>
                    <li>
                        <Link href={"/about"}>About</Link>
                    </li>
                    <li>
                        <Link href={"/login"}>Login</Link>
                    </li>
                </ul>
            </nav>
        </header>
    </div>
  )
}
export default Navbar