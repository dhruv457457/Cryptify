import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import ParticleBackground from "./ParticleBackground";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

function Header() {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const startTour = () => {
    const tour = new driver({
      showProgress: true,
      showButtons: true,
      allowClose: true,
      opacity: 0.1,
      doneBtnText: "Next Page →",
      steps: [
        {
          element: '[data-driver="step1"]',
          popover: {
            title: "Secure DEFI 🔒",
            description:
              "Experience next-gen secure transfers with full transparency.",
            position: "bottom",
          },
        },
    
        {
          element: '[data-driver="step3"]',
          popover: {
            title: "Connect with us on Twitter",
            description:
              "Enjoy our content on twitter",
            position: "bottom",
          },
        },
      ],
      onDestroyed: () => {
        // ✅ Ensures navigation happens when the tour is fully closed
        console.log("Tour finished, navigating to transaction page...");
        localStorage.setItem("startUserTour", "true"); // ✅ Set flag
        navigate("/user");
      },
    });

    tour.drive();
  };

  return (
    <div className="relative bg-customSemiPurple min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 md:px-8 lg:px-16">
      <ParticleBackground />
      {/* Heading */}
      <div className="flex flex-col items-center text-center text-shadow-custom relative z-10">
        <h1 className="text-customPurple text-5xl md:text-6xl lg:text-8xl font-bold">
          The Future of{" "}
        </h1>
        <h1
          data-driver="step1"
          className="text-customBlue text-5xl md:text-6xl lg:text-7xl font-bold"
        >
          Secure DEFI
        </h1>
        <p
          className="text-slate-400 font-semibold text-lg md:text-xl lg:text-xl w-full md:w-3/4 lg:w-1/2 py-4"
        >
          Experience next-generation secure transfers, group payments, and smart
          savings features with unmatched security and seamless user experience.
        </p>
      </div>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-8 relative z-10">
        <button
          data-driver="startTour"
          onClick={startTour}
          className="text-white bg-customPurple px-6 py-3 md:px-8 md:py-3 rounded-md font-semibold shadow-custom-purple transition-all duration-300 ease-in-out hover:bg-customBlue"
        >
          Start Tour 🚀
        </button>

        <button
          data-driver="step3"
          onClick={() => window.open("https://x.com/CryptifySecure", "_blank")}
          className="text-customBlue bg-white px-6 py-3 md:px-8 md:py-3 rounded-md font-semibold border-b-4 border-customBlue shadow-custom-purple transition-all duration-300 ease-in-out hover:bg-customBlue hover:text-white hover:border-white"
        >
          Connect with us
        </button>
      </div>
    </div>
  );
}

export default Header;
