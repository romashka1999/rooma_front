import React from "react";
import { ChartBarIcon } from "@heroicons/react/solid";

const Header = () => {
  return (
    <div className="flex justify-between bg-secondary px-8 py-4 shadow-2xl border-b-8 border-black sticky top-0">
      <h1 className="uppercase text-white text-2xl font-bold">rooma</h1>
      <ChartBarIcon className="h-8 cursor-pointer text-white text" />
    </div>
  );
};

export default Header;
