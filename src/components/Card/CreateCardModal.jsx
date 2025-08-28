"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { TbCurrencyNaira } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";
import { BsCreditCardFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { axiosClient } from "@/utils/AxiosClient";


const cardTypes = ["regular", "vintage", "platinum", "women"];
const token = localStorage.getItem("token");

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(false);
  let [isLoading, setIsLoading] = useState(false);

  let [form, setForm] = useState({
    card_name: "",
    card_type: "",
  });
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

 const createCardform = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!form.card_name || !form.card_type) {
        toast.error("All fields are required");
        setIsLoading(false);
        return;
      }
      console.log(form);

      //send to create card

       const data = await axiosClient.post("/account/create-digital-card",form, {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token.toString()}`,
         },
       });
       if(data.data.msg){
        toast.success(data.data.msg);
       }

 

      setTimeout(() => {
         window.location.reload();
      }, 2000);
    //   setIsLoading(false);
    //   setForm({
    //     card_name: "",
    //     card_type: "",
    //   });
    //   setIsOpen(false);

    } catch (error) {
        console.log(error.response.data.msg)
        console.log(error)
        toast.error(error.response.data.msg);
        setIsLoading(false);
    } 

    // setIsOpen(false)
  }

  return (
    <>
      <button
        className="text-3xl text-purple-800 cursor-pointer"
        onClick={openModal}
      >
        <CiSquarePlus />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-[50vh] items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between mb-4"
                  >
                    <span> Create Card </span>

                    <button
                      className="text-2xl text-black p-2 bg-purple-200 rounded-full cursor-pointer"
                      onClick={closeModal}
                    >
                      <IoClose />
                    </button>
                  </Dialog.Title>
                  <div className="w-[96%] lg:w-[80%] mx-auto">
                    <div className="mb-3 flex items-center gap-x-2 border w-full px-2">
                      {/* <TbCurrencyNaira className="text-2xl" /> */}
                      <input
                        type="text"
                        value={form.card_name}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            card_name: e.target.value,
                          });
                        }}
                        className="w-full py-2 outline-none border-none rounded"
                        placeholder="Enter the name you want on the Card"
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^A-Z, a-z]/g,
                            ""
                          ))
                        }
                      />
                    </div>
                    <div className="mb-3 flex items-center gap-x-2 border w-full px-2">
                      {/* <TbCurrencyNaira className="text-2xl" /> */}
                      {/* <input
                        type="text"
                        className="w-full py-2 outline-none border-none rounded"
                        placeholder="Enter the name you want on the Card"
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ))
                        }
                      /> */}
                      <select
                        name="card_type"
                        id=""
                        className="w-full py-2 outline-none border-none rounded"
                        value={form.card_type}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            card_type: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Card Type</option>
                        {cardTypes.map((type) => (
                          <option value={type.toLowerCase()} key={type}>
                            {type[0].toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3 flex w-full justify-end">
                      <button
                       disabled={isLoading}
                        onClick={createCardform}
                        className="px-3 flex items-center gap-x-2 bg-purple-600 hover:bg-purple-700 cursor-pointer text-white py-2 rounded"
                      >
                        {!isLoading ? (
                          <>
                            <span>Create</span>
                            {/* <FaMoneyBill /> */}
                            <BsCreditCardFill />
                          </>
                        ) : (
                          <CgSpinner className="animate-spin" />
                        )}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
