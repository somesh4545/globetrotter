import React from "react";

const loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default loading;
