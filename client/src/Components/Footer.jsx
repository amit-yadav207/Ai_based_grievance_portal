import React from "react";
import NAVLOGO from "../Images/nav-logo.png";
export default function footer(props) {
  return (
    <>
      <div className="bg-dark-cyan text-white ">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="" className="flex items-center">
                <img src={NAVLOGO} className="h-8 mr-3" alt="FlowBite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  PORTAL
                </span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                  Resources
                </h2>
                <ul className="text-gray-600 dark:text-white font-medium">
                  <li className="mb-4">
                    <a href="" className="hover:underline">
                      Indian Government
                    </a>
                  </li>
                  <li>
                    <a href="" className="hover:underline">
                      NIA
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
