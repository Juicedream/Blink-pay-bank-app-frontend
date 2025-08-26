import HeaderName from "@/components/HeaderName"
import AddAmountModal from "@/components/Amount/AddAmountModal"

const AmountPage = () => {
    const amount = 129731384964.88
  return (
    <>
      <div className="container py-10">
        <HeaderName />
        <div className="card w-1/3 border py-5 rounded flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Add Amount</h1>
            <p>Total Amount: ₦{amount.toLocaleString()}</p>
          </div>
          <AddAmountModal />
        </div>
      </div>
    </>
  );
}
export default AmountPage