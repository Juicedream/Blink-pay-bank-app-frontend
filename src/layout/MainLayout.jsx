import Navbar from "@/components/Navbar"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const MainLayout = ({children}) => {
  return (
    <>
        <ToastContainer />
        <Navbar/>
        {children}
    </>
  )
}
export default MainLayout