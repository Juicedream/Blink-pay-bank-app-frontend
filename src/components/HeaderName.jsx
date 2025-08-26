"use client"
import { useMainContext } from "@/context/MainContext";

const HeaderName = () => {
     const { user } = useMainContext();
  return (
    <>
      <div className="py-2">
        <h1 className="text-5xl font-bold">{user.user?.name}</h1>
      </div>
    </>
  );
}
export default HeaderName   