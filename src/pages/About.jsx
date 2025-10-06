import React, { useEffect, useState } from "react";
import mealLoggingService from "../services/mealLoggingService";
import RecipeModal from "../components/RecipeModal";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <div className="flex flex-row items-center justify-center mt-5">
        <span className="text-2xl sm:text-3xl lg:text-4xl mr-2">🍴</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-center text-transparent">
          About Us
        </h2>
      </div>
    </>
  );
}
