import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

const CustomAuthButton = ({
  isLoading = false,
  type = "submit",
  className = "",
  text,
  ...props
}) => {
  return (
    <>
      <button
        type={type}
        {...props}
        disabled={isLoading}
        className={clsx(
          className,
          isLoading && "disabled:bg-purple-600 text-white",
          "w-full flex items-center justify-center capitalize text-lg hover:cursor-pointer hover:bg-purple-600 bg-purple-900 text-white py-3  gap-x-2 rounded shadow"
        )}
      >
        <span>{text}</span>
        {isLoading && <CgSpinner className="animate-spin text-xl" />}
      </button>
    </>
  );
};
export default CustomAuthButton;
