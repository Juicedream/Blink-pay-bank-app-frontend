"use client";
import { CameraIcon, Loader, PlusCircle, QrCode } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useMainContext } from "@/context/MainContext";
import { toast } from "react-toastify";
import { axiosClient } from "@/utils/AxiosClient";

const page = () => {
  const { user } = useMainContext();
  const videoEl = useRef(null);
  const qrScannerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const token = localStorage.getItem("token");

  const stopScanner = () => {
    qrScannerRef.current?.stop();
    qrScannerRef.current?.destroy();
    qrScannerRef.current = null;
    setShowScanner(false);
  };

  

  const scanQr = () => {
    if (!videoEl.current) return;

    qrScannerRef.current = new QrScanner(
      videoEl.current,
      (result) => {
        setScannedResult(result.data);
        console.log("decoded qr code:", result.data);
        stopScanner(); // hide video + highlights immediately
        const amnt = Number(result.data.split("+")[0]);
        const reciever = Number(result.data.split("+")[2]);
        const pay_Id = result.data.split("+")[3]
        toast.info(`Sending money ₦${amnt} to account Number: ${reciever}...`);
        setTimeout(() => {
          transfer(amnt, pay_Id, reciever);
        }, 4000)
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

  async function transfer(amnt, pay_id, receive_acc) {
    setLoading(true);
    let transferBody = {
      receiver_acc_number: receive_acc,
      sender_pin: user?.user?.pin,
      amount: amnt,
      narration: "Qr Code Payment",
      payId: pay_id
    };
    console.log(transferBody);
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

    if (!user) return;

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
