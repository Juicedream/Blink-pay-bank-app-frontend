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
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.msg);
    }
  }

  useEffect(() => {
    if (transferBody.amount > user?.user.acc_balance) {
      toast.error(
        `Amount cannot be more than ₦${user?.user?.acc_balance.toLocaleString()}`
      );
    }
  }, [transferBody.amount]);

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
