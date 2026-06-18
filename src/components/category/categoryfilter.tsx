"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLocationTree } from "@/lib/api";
import { Location } from "@/lib/types";

export default function LocationFilter() {
  const router = useRouter(); 

  const [divisions, setDivisions] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch location tree on mount
  useEffect(() => {
    getLocationTree()
      .then(setDivisions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedDistrict("");
    const div = divisions.find(d => d.id === divisionId);
    setDistricts(div?.children || []);
  };

const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const locationId = selectedDistrict || selectedDivision;
  if (!locationId) return;

  const currentParams = new URLSearchParams();
  currentParams.set("locationId", locationId);
  router.push(`/bn?${currentParams.toString()}`);
};

  return (
    <div className="w-75 mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
          <h2 className="text-brand text-2xl font-bold tracking-wide mb-1">
          আমার এলাকার খবর
        </h2>
          <div className="w-16 h-1.5 bg-brand rounded-full"></div>
      </div>

      <form onSubmit={handleSearch} className="space-y-5">
        {/* বিভাগ */}
        <div className="relative">
          <select
            value={selectedDivision}
            onChange={e => handleDivisionChange(e.target.value)}
            disabled={loading}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-500 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <option value="" disabled hidden>
              {loading ? "লোড হচ্ছে..." : "বিভাগ"}
            </option>
            {divisions.map(div => (
              <option key={div.id} value={div.id}>
                {div.nameBn}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* জেলা */}
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            disabled={loading || !selectedDivision || districts.length === 0} // 👈 Added loading protection
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-4 text-gray-500 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled hidden>
              {loading ? "লোড হচ্ছে..." : "জেলা"}
            </option>
            {districts.map(dist => (
              <option key={dist.id} value={dist.id}>
                {dist.nameBn}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
            <ChevronDown size={24} strokeWidth={2.5} />
          </div>
        </div>

          <button
            type="submit"
            disabled={!selectedDivision}
            className="w-full bg-brand hover-bg-brand text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 text-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
          <Search size={22} strokeWidth={2} />
          <span>খুঁজুন</span>
        </button>
      </form>
    </div>
  );
}
