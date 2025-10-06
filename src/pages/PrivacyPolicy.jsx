import React, { useEffect, useState } from "react";
import mealLoggingService from "../services/mealLoggingService";
import RecipeModal from "../components/RecipeModal";
import { Link } from "react-router-dom";

export default function About() {
  const [allMeals, setAllMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const loadMealData = async () => {
    const meals = await mealLoggingService.getAllMealLogs();
    setAllMeals(meals);
  };

  const handleModal = (meal) => {
    console.log(meal);
    setShowModal(true);
    setSelectedRecipe(meal);
  };

  useEffect(() => {
    loadMealData();
  }, []);

  return (
    <>
      <div className="flex flex-row items-center justify-center mt-5">
        <span className="text-2xl sm:text-3xl lg:text-4xl mr-2">🍴</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-center text-transparent">
          Privacy Policy
        </h2>
      </div>
    </>
  );
}
