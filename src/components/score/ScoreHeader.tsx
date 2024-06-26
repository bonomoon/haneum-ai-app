"use-client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../Container";
import LoadingSpinner from "../LoadingSpinner";
import { EpsonAuthToken, EpsonDeviceInfo } from "@types";

interface ScoreHeaderProps {
  className?: string;
  auth: EpsonAuthToken | null;
  onAuthClick: () => void;
  onAuthUpdateClick: () => void;
}

export default function ScoreHeader({
  className,
  auth,
  onAuthClick,
  onAuthUpdateClick,
}: ScoreHeaderProps) {
  const [epsonDeviceInfo, setEpsonDeviceInfo] =
    useState<EpsonDeviceInfo | null>(null);
  const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);

  useEffect(() => {
    if (auth !== null) {
      fetchEpsonConnectDevice();
    }
  }, [auth]);

  const fetchEpsonConnectDevice = async () => {
    setIsDeviceLoading(true);

    const res = await fetch(`/api/epson/devices/${auth?.subject_id}`, {
      method: "GET",
      headers: {
        Authorization: `${auth?.token_type} ${auth?.access_token}`,
      },
    });

    const data = await res.json();

    setIsDeviceLoading(false);

    if (res.ok) {
      console.log("Authenticated successfully", data);
      setEpsonDeviceInfo(data);
    } else {
      console.error("Authentication failed", data);
    }
  };

  return (
    <header className={`text-center sm:text-left py-2 ${className}`}>
      <Container className="flex flex-row justify-between items-center">
        <h1>
          <Link href="/">
            <img src="/logo.svg" alt="Haneum AI" className="h-8 w-auto" />
          </Link>
        </h1>
        <div className="absolute mx-auto left-0 right-0 w-1/2 text-xs">
          {isDeviceLoading ? (
            <button
              className="flex justify-center items-center text-xs w-full bg-slate-200 active:bg-slate-300 active:after:bg-slate-200 border border-gray-300 transform transition-colors rounded-2xl px-2 py-2 duration-300"
              onClick={onAuthUpdateClick}
            >
              <LoadingSpinner className="w-4 h-4 fill-gray-600 text-gray-200" />
            </button>
          ) : epsonDeviceInfo === null ? (
            <button
              className="flex justify-center items-center text-xs w-full bg-slate-200 active:bg-slate-300 active:after:bg-slate-200 border border-gray-300 transform transition-colors rounded-2xl px-2 py-2 duration-300"
              onClick={onAuthClick}
            >
              <div className="absolute left-2 w-3 h-3 rounded-full bg-gray-500"></div>
              <div className="text-center">Epson Connect 연결하기</div>
            </button>
          ) : (
            <button
              className="flex justify-center items-center w-full bg-slate-200 active:bg-slate-300 active:after:bg-slate-200 border border-gray-300 transform transition-colors rounded-2xl px-2 py-2 duration-300"
              onClick={onAuthUpdateClick}
            >
              {epsonDeviceInfo?.ec_connected ? (
                <div className="absolute left-2 w-3 h-3 rounded-full bg-green-500"></div>
              ) : (
                <div className="absolute left-2 w-3 h-3 rounded-full bg-red-500"></div>
              )}
              <div className="text-center">
                {epsonDeviceInfo.printer_name
                  ? `${epsonDeviceInfo.printer_name}-${epsonDeviceInfo.serial_no}`
                  : "등록된 제품이 없습니다."}
              </div>
            </button>
          )}
        </div>
        <div></div>
      </Container>
    </header>
  );
}
