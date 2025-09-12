"use client";
import { useMainContext } from "@/context/MainContext";
import "../transfer-form.css";
import "../pin-form.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { axiosClient } from "@/utils/AxiosClient";
const transferPage = () => {
  const { user } = useMainContext();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [transferBody, setTransferBody] = useState({
    receiver_acc_number: "",
    sender_pin: "",
    amount: "",
    narration: "",
  });

  async function showPop() {
    setLoading(true);
    try {
      const response = await axiosClient.post(
        "/account/single-transfer",
        transferBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      toast.success(data.msg);
      setTransferBody({
        receiver_acc_number: "",
        sender_pin: "",
        amount: "",
        narration: "",
      });
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.msg);
    }
  }

  async function showAccountName() {
    console.log("Fetching account name...");
    toast.info("Fetching account name...");
    try {
      const response = await axiosClient.get(
        "/account/show-account-info/" + transferBody.receiver_acc_number,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);
      toast.success(data.msg);
      setAccountName(data.account_info?.name);
    } catch (error) {
      console.log(error.response.data.msg);
      toast.error(error.response.data.msg);
      setAccountName("");
    }
  }

   useEffect(() => {
      const websocket = new WebSocket(
        "wss://blink-pay-bank-app-backend.onrender.com"
      );
  
      websocket.onopen = () => {
        console.log("WebSocket connection established");
      };
  
      websocket.onmessage = (event) => {
        const { event: evt, data } = JSON.parse(event.data);
        // your are the receiver
        if(data?.transaction?.receiver_id === user?.user?.userId){
        if (evt === "money_received") {
          //  setShowToast(data);
          console.log("Money received", {
            data,
            amount: data?.transaction.amount,
          });
          toast.success(data?.transaction?.sender_name + " just credited your account with " + `₦${data?.transaction?.amount.toLocaleString()}`);
        }

        if(evt === "card_payment_successful"){
          //  setShowToast(data);
          console.log("Money received", {
            data,
            amount: data?.transaction.amount,
          });
          toast.success(
            "Credit Alert - Payverge platform via card: " +
              `₦${data?.transaction?.amount.toLocaleString()}`
          );
        }
        }
        // you are the sender
         if (
           data?.transaction?.sender_id === user?.user?.userId &&
           data?.transaction?.payment_id
         ) {
           if (evt === "card_payment_successful") {
             //  setShowToast(data);
             console.log("Your card was used on a payment platform", {
               data,
               amount: data?.transaction.amount,
             });
             toast.success(
               "You just used your card to pay" +
                 `₦${data?.transaction?.amount.toLocaleString()}` +
                 " on payverge platform"
             );
           }
           if (evt === "card_payment_failed") {
             //  setShowToast(data);
             console.log("Your card was used on a payment platform", {
               data,
               amount: data?.transaction.amount,
             });
             toast.success(
               "Failed - You tried used your card to pay" +
                 `₦${data?.transaction?.amount.toLocaleString()}` +
                 " on payverge platform"
             );
           }
         };



    }
  
      // websocket.onclose = () => {
      //   console.log("Disconnected ❌");
      // };
  
      // websocket.onerror = (error) => {
      //   console.error("WebSocket error:", error);
      // };
  
      // ✅ cleanup so double-mount won’t leave ghost sockets
      return () => {
      if (websocket) {
        console.log("🔒 Closing WebSocket safely...");
        websocket.close();
      }
      
        
    };
    }, [])
  useEffect(() => {
    if (transferBody.amount > user?.user.acc_balance) {
      toast.error(
        `Amount cannot be more than ₦${user?.user?.acc_balance.toLocaleString()}`
      );
    }
  }, [transferBody.amount]);

  useEffect(() => {
    if (transferBody.receiver_acc_number?.toString().length === 10) {
      console.log("Valid account number");
      showAccountName();
      return;
    }else{
      setAccountName("");
    }
  }, [transferBody.receiver_acc_number,]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="subscribe">
          <p>Intra-Bank Transfer</p>
          <div className="mb-5">
            <p className="text-sm">
              <b>Balance: ₦{user?.user?.acc_balance.toLocaleString()}</b>
            </p>
          </div>
          <input
            placeholder={`Your account number: ${user?.user?.acc_number}`}
            className="subscribe-input"
            name="sender_acc_number"
            type="number"
            disabled
          />
          <input
            placeholder="Receipient's Account Number"
            className="subscribe-input"
            name="receiver_acc_number"
            value={transferBody.receiver_acc_number}
            onChange={(e) =>
              setTransferBody({
                ...transferBody,
                receiver_acc_number: Number(e.target.value),
              })
            }
            type="text"
          />
          <p className="text-green-600 border-yellow-500 border-1" disabled>
            {accountName && accountName}
          </p>
          <input
            placeholder="Amount to send"
            className="subscribe-input"
            name="amount"
            type="number"
            value={transferBody.amount}
            onChange={(e) =>
              setTransferBody({
                ...transferBody,
                amount: Number(e.target.value),
              })
            }
          />
          <input
            placeholder="Narration"
            className="subscribe-input"
            name="narration"
            type="text"
            value={transferBody.narration}
            onChange={(e) =>
              setTransferBody({
                ...transferBody,
                narration: e.target.value,
              })
            }
          />
          <input
            placeholder="Your Pin"
            className="subscribe-input"
            name="sender_pin"
            type="text"
            value={transferBody.sender_pin}
            onChange={(e) =>
              setTransferBody({
                ...transferBody,
                sender_pin: e.target.value,
              })
            }
          />
          <br />
          <div
            onClick={showPop}
            className="submit-btn"
            title="click to transfer"
          >
            {loading ? <CgSpinner className="text-xl animate-spin" /> : "SEND"}
          </div>
        </div>
      </div>
    </>
  );
};
export default transferPage;
