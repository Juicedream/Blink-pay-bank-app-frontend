"use client"
import Link from "next/link"
import Logo from "./resusable/Logo"
import { useMainContext } from "@/context/MainContext"
import {GiHamburgerMenu} from "react-icons/gi"
import { useDispatch } from "react-redux"
import { setIsToggle } from "@/redux/slice/sidebarSlice"

const Navbar = () => {
    const {user, LogoutHandler} = useMainContext()
    const dispatch = useDispatch()
  return (
    <div>
      <header className="w-full border-b rounded-b-md py-2">
        <nav className="w-[98%] lg:w-[80%] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <button onClick={() => dispatch(setIsToggle())} className="bg-gray-100 rounded-full p-2 text-x sm:hidden hover:bg-gray-200 cursor-pointer">
                <GiHamburgerMenu />
            </button>
            <Logo />
          </div>
          <ul className="flex items-center justify-center gap-x-2">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            {/* <li>
                        <Link href={"/services"}>Services</Link>
                    </li> */}
            <li>
              <Link href={"/about"}>About</Link>
            </li>
            <li>
              {user ? (
                <button
                  onClick={LogoutHandler}
                  className="bg-purple-800 text-white px-4 py-1 cursor-pointer
                         font-medium rounded"
                >
                  Logout
                </button>
              ) : (
                <Link href={"/login"}>Login</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
export default Navbar