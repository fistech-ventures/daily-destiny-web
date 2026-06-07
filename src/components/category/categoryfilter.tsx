"use client";
import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function LocationFilter() {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", { division, district, upazila });
  };

  return (
    <div className="w-75 mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-[#1a66ca] text-2xl font-bold tracking-wide mb-1">
          আমার এলাকার খবর
        </h2>
        <div className="w-16 h-1.5 bg-[#3b82f6] rounded-full"></div>
      </div>

      <form onSubmit={handleSearch} className="space-y-5">
        <div className="relative">
          <select
            value={division}
            onChange={e => setDivision(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-500 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="" disabled hidden>
              বিভাগ
            </option>
            <option value="dhaka">ঢাকা</option>
            <option value="chattogram">চট্টগ্রাম</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative">
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-500 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="" disabled hidden>
              জেলা
            </option>
            <option value="dhaka-dist">ঢাকা</option>
            <option value="gazipur">গাজীপুর</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative">
          <select
            value={upazila}
            onChange={e => setUpazila(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-500 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="" disabled hidden>
              উপজেলা
            </option>
            <option value="savar">সাভার</option>
            <option value="mirpur">মিরপুর</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 text-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer"
        >
          <Search size={22} strokeWidth={2} className="" />
          <span>খুঁজুন</span>
        </button>
      </form>
    </div>
  );
}
