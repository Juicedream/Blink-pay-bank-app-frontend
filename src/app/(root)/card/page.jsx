"use client";
import HeaderName from "@/components/HeaderName";
import CreateCardModal from "@/components/Card/CreateCardModal";
import { useMainContext } from "@/context/MainContext";
import CreditCard from "@/components/Card/CreditCard";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
const bgColor = {
  regular: "hover:bg-purple-900",
  vintage: "hover:bg-amber-900",
  platinum: "hover:bg-yellow-600",
  women: "hover:bg-pink-900",
  "": "hover:bg-black",
};
const textColor = {
  regular: "text-purple-900",
  vintage: "text-amber-900",
  platinum: "text-yellow-600",
  women: "text-pink-900",
  "": "text-black",
};
const borderColor = {
  regular: "border-purple-900",
  vintage: "border-amber-900",
  platinum: "border-yellow-600",
  women: "border-pink-900",
  "": "border-black",
};

const CardPage = () => {
  const { user } = useMainContext();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [decrypted, setDecrypted] = useState({});
  const decryptedCard = async () => {
    const data = await axiosClient("/account/show-card", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setDecrypted(data?.data.card);
  };
  const deleteCard = async (cardId) => {
    let payload = {
      card_id: cardId
    };
    setIsLoading(true);
    try {
      const deleteThisCard = await axiosClient.post("account/delete-card", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(deleteThisCard);
      console.log("Deleted card", cardId);
      toast.success(deleteThisCard.data.msg)
         setTimeout(() => {
           window.location.reload();
         }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
      setIsLoading(false)
    }
  };
  useEffect(() => {
    if (user && user.card) {
      decryptedCard();
    }
  }, []);

  return (
    <>
      <div className="container py-10">
        <HeaderName />
        <div className="card w-full border py-5 rounded flex items-center justify-between">
          {!user?.card ? (
            <>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Create Card</h1>
                {/* <p>Total Amount: ₦{amount.toLocaleString()}</p> */}
              </div>
              <CreateCardModal />
            </>
          ) : (
            <>
              <div className="">
                <CreditCard
                  acc_type={user?.card.acc_type}
                  card_name={user?.card.card_name.toUpperCase()}
                  card_type={user?.card.card_type}
                  card_cvv={decrypted?.cvv}
                  card_expiry={decrypted?.expiry_date}
                  card_pan_number={decrypted?.pan_number}
                />
                <div className="flex space-x-4 ml-2 my-5 justify-end">
                  {/* <button
                    className={`border ${
                      borderColor[user?.card.card_type]
                    } px-2 ${
                      textColor[user?.card.card_type]
                    } rounded-md cursor-pointer ${
                      bgColor[user?.card.card_type]
                    } hover:text-white`}
                    disabled
                  >
                    Block
                  </button> */}
                  <button
                    type="button"
                    disabled={isLoading}
                    className={`border text-red-500 px-2 rounded-md border-red-500 hover:text-white hover:bg-red-500  ${
                      isLoading ? "bg-red-500 cursor-none" : "cursor-pointer"
                    }`}
                    onClick={() => deleteCard(user?.card._id)}
                  >
                    {!isLoading ? (
                      "Delete Card"
                    ) : (
                      <CgSpinner className="animate-spin text-white" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default CardPage;
