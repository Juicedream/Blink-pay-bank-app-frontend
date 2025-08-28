"use client";
import Loader from "@/components/Loader";
import { useMainContext } from "@/context/MainContext";
import { setIsToggle, SidebarSlicePath } from "@/redux/slice/sidebarSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";
import {MdDashboard} from "react-icons/md"
import { GiFalloutShelter } from "react-icons/gi";
import { GrCurrency } from "react-icons/gr";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { RiHistoryFill } from "react-icons/ri";
import { BsCreditCardFill } from "react-icons/bs";


const RootTemplate = ({ children }) => {
  const { user } = useMainContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isToggle = useSelector(SidebarSlicePath)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  const CustomMenu =({link, text, Icon}) =>{
    const pathname = usePathname()
    return (
      <>
        <MenuItem
          style={{
            background: pathname === link ? "#581C87": "#fff",
            color: pathname === link ? "white" : "black",
            borderRadius: pathname === link ? "8px" : "0px",
          }}

          component={<Link href={link} />}
          icon={<Icon className="text-2xl"/>}
        >
          {text}
        </MenuItem>
      </>
    );
  }
  return (
    <section className="flex items-start">
      <Sidebar
        breakPoint="lg"
        toggled={isToggle}
        onBackdropClick={() => dispatch(setIsToggle)}
      >
        <Menu className="!bg-white !min-h-screen lg:!min-h-[90vh] px-3 py-10">
          <CustomMenu link="/" text="Home" Icon={MdDashboard} />
          {/* <CustomMenu link="/amount" text="Amount" Icon={GrCurrency} /> */}
          <CustomMenu
            link="/transfer"
            text="Transfer Money"
            Icon={FaMoneyBillTransfer}
          />
          <CustomMenu
            link="/transaction-history"
            text="Transaction History"
            Icon={RiHistoryFill}
          />
          <CustomMenu
            link="/card"
            text="Card"
            Icon={BsCreditCardFill}
          />
          <CustomMenu link="/profile" text="Profile" Icon={GiFalloutShelter} />
        </Menu>
      </Sidebar>
      <main className="px-1 md:px-3 w-full">{children}</main>
    </section>
  );
};
export default RootTemplate;
