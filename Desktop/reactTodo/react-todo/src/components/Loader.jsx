import React from "react";

function Loader(props) {
  return (
    <div className="flex justify-center items-center h-screen">
      Loading ...
      <div className="border-8 border-gray-300 border-t-8 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
}

export default Loader;
