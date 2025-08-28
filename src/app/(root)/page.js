"use client"
import HeaderName from "@/components/HeaderName";
import { useMainContext } from "@/context/MainContext";
import Link from "next/link";
import {  FaMoneyBill, FaCreditCard } from "react-icons/fa6";
import {  RiCoinsLine } from "react-icons/ri";
const HomePage = () => {
  const { user } = useMainContext();
  console.log(user.acc_balance);
  const dashboardData = [
    {
      title: "Amount",
      icon: FaMoneyBill,
      value: user?.user.acc_balance || 0,
      color: "text-green-500",
      link: "/amount"
    },
    // {
    //   title: "FD Amount",
    //   icon: RiCoinsLine,
    //   value: 8765291.9,
    //   color: "text-yellow-500",
    //   link: "/fd-amount"
    // },
    {
      title: "Cards",
      icon: FaCreditCard,
      value: user?.card === null ? 0 : 1,
      color: "text-purple-500",
      link: "/card"
    },
  ];
 
  return (
    <>
      <div className="py-10 flex flex-col gap-y-4">
       <HeaderName />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-3">
          {dashboardData
            .map((curr, i) => (
              <DashboardCard data={curr} key={i} />
            ))}
        </div>
      </div>
    </>
  );
};
export default HomePage;

const DashboardCard = ({data}) => {
  const amount = 12789.08
  return <Link href={data.link} className="flex items-center justify-between rounded border py-3 px-10 shadow-xl hover:text-white hover:bg-purple-800">
    <data.icon className={`text-8xl ${data.color}`}/>
    <div className="flex flex-col gap-y-2 justify-end">
      <p className="text-3xl font-semibold">{data.title.toUpperCase()}</p>
      <h3 className="text-4xl font-bold text-end">
      {data.title !== "Cards" ? `₦ ${data.value.toLocaleString()}` : data.value}  
      </h3> 
    </div>
  </Link>;
};
