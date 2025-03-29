"use client";

import { ScanReceipt } from "@/actions/transaction";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Camera, Loader2 } from "lucide-react";

const ReceiptScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef(null);
  const [scanReceiptLoading, setScanReceiptLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    setScanReceiptLoading(true);
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      setScanReceiptLoading(false);
      return;
    }

    try {
    const res = await ScanReceipt(file);
    console.log("res", res);

    if(res.success){
        onScanComplete(res.data);
        toast.success("Receipt scanned successfully");
    }

    } catch (error) {
      console.error("error", error);
    }
    finally{
        setScanReceiptLoading(false);
    }
  };

  return (
    <div className="flex items-center  gap-4">
        <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleReceiptScan(file);
          }}
       />
        <Button
        type="button"
        variant="outline"
        className="w-full h-10 cursor-pointer bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>

    </div>
  )
};

export default ReceiptScanner;
