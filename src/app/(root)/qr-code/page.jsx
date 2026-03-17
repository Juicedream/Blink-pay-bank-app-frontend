"use client";
import { CameraIcon, Loader, PlusCircle, QrCode } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useMainContext } from "@/context/MainContext";
import { toast } from "react-toastify";

const page = () => {
  const { user } = useMainContext();
  const videoEl = useRef(null);
  const qrScannerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [receiverAcc, setReceiverAcc] = useState("");
  const [amount, setAmount] = useState(0);
  const token = localStorage.getItem("token");
  let transferBody = {
    receiver_acc_number: receiverAcc,
    sender_pin: user?.user?.pin,
    amount: amount,
    narration: "Qr Code Payment",
  };
 
  const stopScanner = () => {
    qrScannerRef.current?.stop();
    qrScannerRef.current?.destroy();
    qrScannerRef.current = null;
    setShowScanner(false);
  };

  async function transfer() {
    setLoading(true);
    try {
      const response = await axiosClient.post(
        "/account/single-transfer",
        transferBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data;
      toast.success(data.msg);
      setAmount(0);
      setReceiverAcc(0);
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

  const scanQr = () => {
    if (!videoEl.current) return;

    qrScannerRef.current = new QrScanner(
      videoEl.current,
      (result) => {
        setScannedResult(result.data);
        console.log("decoded qr code:", result.data);
        stopScanner(); // hide video + highlights immediately
        setLoading(true);
        const amnt = Number(result.data.split("+")[0]);
        setAmount(amnt);
        const reciever = Number(result.data.split("+")[2]);
        setReceiverAcc(receiverAcc)
        toast.info(`Transfering ₦${amnt}...`);
        transfer();
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      },
    );

    qrScannerRef.current.start();
    setShowScanner(true);
  };

  const handleQrScaningImage = () => {
    QrScanner.listCameras(true);

    if (showScanner) {
      stopScanner(); // toggle off if already scanning
    } else {
      scanQr();
    }
  };

  const handlePayment = () => {};

  useEffect(() => {
    return () => stopScanner(); // cleanup on unmount
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 items-center mt-4">
      <div className="flex lg:flex-row flex-col w-full justify-between lg:px-16 gap-8">
        <button
          className="ring-1 p-4 rounded-2xl flex justify-between hover:cursor-pointer 
            lg:gap-4 hover:shadow-lg hover:shadow-black hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white hover:ring-0"
        >
          <QrCode />
          Generate QR Code
          <PlusCircle />
        </button>
        <button
          onClick={handleQrScaningImage}
          className="ring-1 p-4 rounded-2xl flex justify-between hover:cursor-pointer hover:shadow-lg hover:shadow-black
            lg:gap-4 hover:-translate-y-0.5 hover:bg-purple-600 hover:text-white hover:ring-0"
        >
          <QrCode />
          Scan QR Code
          <CameraIcon />
        </button>
      </div>

      {/* <p>Scanned result: {scannedResult}</p> */}

      {loading && (
        <p className="animate-spin">
          <Loader size={32} />
        </p>
      )}

      {/* Video only renders in the DOM when scanning */}
      <video
        ref={videoEl}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: showScanner ? "block" : "none",
        }}
      />
    </div>
  );
};

export default page;
