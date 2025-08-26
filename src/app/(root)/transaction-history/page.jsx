"use client"

import { useMainContext } from "@/context/MainContext";

const TransactionHistory = () => {
    const {user} = useMainContext()
  return (
    <>
      <div className="flex items-center ml-4 my-4">
        <table className="border border-black">
          <thead>
            <tr className="border-black">
              <th className="px-2 border-r-2">Transaction Ref ID</th>
              <th className="px-2 border-r-2">Narration</th>
              <th className="px-2 border-r-2">Amount</th>
              <th className="px-2 border-r-2">Transaction Type</th>
              <th className="px-2 border-r-2">Channel</th>
              <th className="px-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {user.tran_history?.map((history) => (
              <tr className="border-t border-black text-center" key={history._id}>
                <td className="px-2 border-r-2">{history.ref_id}</td>
                <td className="px-2 border-r-2">{history.narration}</td>
                <td className="px-2 border-r-2">
                  ₦{history.amount.toLocaleString()}
                </td>
                <td
                  className={`px-2 border-r-2 ${
                    history.tran_type === "debit"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {history.tran_type[0].toUpperCase() + history.tran_type.slice(1)}
                </td>
                <td className="px-2 border-r-2">{history.channel[0].toUpperCase() + history.channel.slice(1)}</td>
                <td className={`px-2`}>{history.status[0].toUpperCase() + history.status.slice(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default TransactionHistory;
