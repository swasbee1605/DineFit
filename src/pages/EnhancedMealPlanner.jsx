import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import ImageUpload from "../components/ImageUpload";
import { Card, CardContent } from "../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Download, Save, ChevronDown, FileJson, FileText, FileType } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { useAuth } from "../contexts/AuthContext";
import { enhancedMealPlannerService } from "../services/enhancedMealPlannerService";

const dietaryOptions = ["Vegetarian", "Vegan", "Keto", "Paleo", "Balanced"];

const dishes = {
  Vegetarian: [
    "Overnight Oats with Berries", "Greek Yogurt Parfait", "Spinach and Mushroom Omelette",
    "Whole Grain Pancakes with Fruit", "Quinoa Buddha Bowl", "Mediterranean Pasta Salad",
    "Grilled Vegetable Wrap", "Lentil and Spinach Curry", "Eggplant Parmesan",
    "Mushroom Risotto", "Vegetable Lasagna", "Stuffed Bell Peppers"
  ],
  Vegan: [
    "Chia Seed Pudding", "Tofu Scramble", "Avocado Toast with Seeds",
    "Almond Milk Smoothie Bowl", "Buddha Bowl with Tahini Dressing",
    "Chickpea Salad Sandwich", "Lentil and Vegetable Soup", "Quinoa Stuffed Sweet Potato"
  ],
  Keto: [
    "Bacon and Eggs", "Keto Coffee with MCT Oil", "Cream Cheese Pancakes",
    "Avocado and Egg Bowl", "Tuna Salad Lettuce Wraps", "Caesar Salad with Chicken",
    "Butter Chicken", "Grilled Ribeye Steak", "Baked Salmon with Herbs"
  ],
  Paleo: [
    "Sweet Potato Hash with Eggs", "Grain-Free Granola", "Turkey and Avocado Bowl",
    "Banana Almond Pancakes", "Chicken and Avocado Lettuce Wraps", "Tuna Nicoise Salad",
    "Grass-Fed Beef Burger", "Roasted Chicken with Herbs"
  ],
  Balanced: [
    "Whole Grain Toast with Eggs", "Steel Cut Oats with Fruit", "Protein Smoothie Bowl",
    "Whole Wheat Bagel with Cream Cheese", "Turkey and Avocado Sandwich",
    "Mixed Green Salad with Grilled Chicken", "Grilled Fish with Brown Rice",
    "Lean Beef Stir-Fry", "Chicken Breast with Sweet Potato"
  ],
};

export default function EnhancedMealPlanner() {
  const { user, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mealImages, setMealImages] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: null,
  });
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [activePlanId, setActivePlanId] = useState(
    localStorage.getItem("activePlanId") || null
  );
  const [diet, setDiet] = useState("");
  const [mealPlan, setMealPlan] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });
  const [savedPlans, setSavedPlans] = useState([]);
  const [showPastPlans, setShowPastPlans] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [customDishes, setCustomDishes] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  });
  const [suggestions, setSuggestions] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [savedCustomDishes, setSavedCustomDishes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize service with user
  useEffect(() => {
    if (user) {
      enhancedMealPlannerService.setUser(user.$id);
    }
    loadSavedData();
  }, [user]);

  // Load saved data
  const loadSavedData = () => {
    const plans = enhancedMealPlannerService.getSavedPlans();
    setSavedPlans(plans);
    
    const custom = JSON.parse(localStorage.getItem("customDishes") || "[]");
    setSavedCustomDishes(custom);
  };

  const handleOpenImageUpload = (mealType) => {
    setSelectedMealType(mealType);
    setIsImageUploadOpen(true);
  };

  const handleImageSelect = (imageData) => {
    if (selectedMealType) {
      setMealImages((prev) => ({
        ...prev,
        [selectedMealType]: imageData,
      }));
      setIsImageUploadOpen(false);
    }
  };

  const getSuggestions = (input, mealType) => {
    if (!input) return [];
    input = input.toLowerCase();
    const allDishes = [...Object.values(dishes).flat(), ...savedCustomDishes];

    const scoredMatches = allDishes
      .map((dish) => {
        const lowerDish = dish.toLowerCase();
        let score = 0;

        if (lowerDish.startsWith(input)) score += 100;
        else if (lowerDish.includes(" " + input)) score += 50;
        else if (lowerDish.includes(input)) score += 25;

        if (lowerDish.includes(mealType.toLowerCase())) score += 10;

        return { dish, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredMatches.slice(0, 8).map(({ dish }) => dish);
  };

  const handleCustomDishChange = (mealType, value) => {
    setCustomDishes((prev) => ({
      ...prev,
      [mealType]: value,
    }));
    setSuggestions((prev) => ({
      ...prev,
      [mealType]: getSuggestions(value, mealType),
    }));
  };

  const handleSelectSuggestion = (mealType, dish) => {
    setCustomDishes((prev) => ({
      ...prev,
      [mealType]: dish,
    }));
    setSuggestions((prev) => ({
      ...prev,
      [mealType]: [],
    }));
    setMealPlan((prev) => ({
      ...prev,
      [mealType]: dish,
    }));
  };

  const saveCustomDish = (dish) => {
    if (!dish || savedCustomDishes.includes(dish)) return;
    const newSavedDishes = [...savedCustomDishes, dish];
    setSavedCustomDishes(newSavedDishes);
    localStorage.setItem("customDishes", JSON.stringify(newSavedDishes));
  };

  const generatePlan = async () => {
    if (!diet) {
      alert("Please select a diet type first!");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use enhanced service for generation with caching
      const preferences = {
        diet,
        userProfile,
        customDishes: Object.keys(customDishes).reduce((acc, key) => {
          if (customDishes[key]) acc[key] = customDishes[key];
          return acc;
        }, {})
      };

      const generatedPlan = await enhancedMealPlannerService.generateMealPlan(preferences);
      
      // Update UI with generated plan
      const planMeals = {};
      Object.entries(generatedPlan.meals).forEach(([type, meal]) => {
        planMeals[type] = typeof meal === 'string' ? meal : meal.name;
      });
      
      setMealPlan(planMeals);
      console.log('✅ Meal plan generated successfully');
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback to simple generation
      generateSimplePlan();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSimplePlan = () => {
    const selected = dishes[diet];
    const randomIndex = () => Math.floor(Math.random() * selected.length);
    setMealPlan({
      breakfast: customDishes.breakfast || selected[randomIndex()],
      lunch: customDishes.lunch || selected[randomIndex()],
      dinner: customDishes.dinner || selected[randomIndex()],
      snacks: customDishes.snacks || selected[randomIndex()],
    });
  };

  const replaceMeal = (mealType) => {
    const alternatives = dishes[diet];
    const random =
      alternatives[Math.floor(Math.random() * alternatives.length)];
    setMealPlan({ ...mealPlan, [mealType]: random });
  };

  const saveMealPlan = () => {
    try {
      const newPlan = {
        date: new Date().toISOString(),
        diet,
        plan: mealPlan,
        images: mealImages,
        id: Date.now(),
        preferences: { diet, userProfile }
      };
      
      const savedPlan = enhancedMealPlannerService.saveMealPlan(newPlan);
      loadSavedData();
      
      alert("Meal plan saved successfully!");

      if (window.confirm("Do you want to set this plan as your active plan?")) {
        setActivePlanId(savedPlan.id);
        localStorage.setItem("activePlanId", savedPlan.id);
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert("Failed to save meal plan. Please try again.");
    }
  };

  const deletePlan = (planId) => {
    if (window.confirm("Are you sure you want to delete this meal plan?")) {
      const updatedPlans = savedPlans.filter((plan) => plan.id !== planId);
      setSavedPlans(updatedPlans);
      localStorage.setItem("savedMealPlans", JSON.stringify(updatedPlans));

      if (activePlanId === planId) {
        setActivePlanId(null);
        localStorage.removeItem("activePlanId");
      }
    }
  };

  const clearAllPlans = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all saved meal plans? This action cannot be undone."
      )
    ) {
      setSavedPlans([]);
      localStorage.setItem("savedMealPlans", "[]");
    }
  };

  const handleExport = async (format) => {
    if (!mealPlan.breakfast) {
      alert("Please generate a meal plan first!");
      return;
    }

    const exportPlan = {
      id: Date.now(),
      date: new Date().toISOString(),
      diet,
      plan: mealPlan,
      meals: mealPlan,
      images: mealImages,
      preferences: { diet, userProfile }
    };

    const success = await enhancedMealPlannerService.export(exportPlan, format, {
      includeMetadata: true
    });

    if (success) {
      alert(`Meal plan exported as ${format.toUpperCase()} successfully!`);
    } else {
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🍽️ Meal Planner
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Create your perfect meal plan with smart caching & export features
          </p>
        </div>

        <div className="space-y-8">
          {/* Active Plan Display */}
          {activePlanId &&
            (() => {
              const activePlan = savedPlans.find(
                (p) => p.id === Number(activePlanId)
              );
              if (!activePlan) return null;

              return (
                <div className="mb-8 p-6 bg-white/90 border-4 border-emerald-500 rounded-3xl shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                      🌟 Active Meal Plan
                    </h2>
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-emerald-600 rounded-full">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Diet Type: {activePlan.diet}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(activePlan.plan).map(([mealType, dish]) => (
                      <div
                        key={mealType}
                        className="bg-emerald-50/80 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl mb-3">
                          {mealType === "breakfast" && "🌅"}
                          {mealType === "lunch" && "🌞"}
                          {mealType === "dinner" && "🌙"}
                          {mealType === "snacks" && "🍎"}
                        </div>
                        <h4 className="font-semibold capitalize text-emerald-800 mb-2">
                          {mealType}
                        </h4>
                        <p className="text-gray-700 text-center mb-2">{dish}</p>
                        {activePlan.images && activePlan.images[mealType] && (
                          <img
                            src={activePlan.images[mealType]}
                            alt={dish || mealType}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          {/* Collapsible Recent Plans */}
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="backdrop-blur-sm bg-white/60 rounded-3xl p-8 shadow-xl border border-white/50 transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center mb-6">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center gap-2 hover:bg-transparent p-0"
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Recent Meal Plans{" "}
                    {savedPlans.length > 0 && `(${savedPlans.length})`}
                  </h2>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {savedPlans.length > 0 && (
                  <Button
                    onClick={clearAllPlans}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <CollapsibleContent className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 gap-6 mb-4">
                {savedPlans
                  .filter(
                    (plan) => !searchDate || plan.date.includes(searchDate)
                  )
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, showPastPlans ? undefined : 3)
                  .map((plan, index) => (
                    <div
                      key={index}
                      className="bg-white/80 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-700">
                            {new Date(plan.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h3>
                          <p className="text-gray-600">
                            Diet Type: {plan.diet}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDiet(plan.diet);
                              setMealPlan(plan.plan);
                              setMealImages(
                                plan.images || {
                                  breakfast: null,
                                  lunch: null,
                                  dinner: null,
                                  snacks: null,
                                }
                              );
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            Restore Plan
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePlan(plan.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(plan.plan).map(([mealType, dish]) => (
                          <div
                            key={mealType}
                            className="bg-emerald-50/50 rounded-lg p-4"
                          >
                            <h4 className="font-medium capitalize text-emerald-800 mb-2">
                              {mealType}
                            </h4>
                            <p className="text-gray-700">{dish}</p>
                            {plan.images && plan.images[mealType] && (
                              <img
                                src={plan.images[mealType]}
                                alt={dish || mealType}
                                className="w-full h-32 object-cover rounded-lg mt-2 shadow"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                {savedPlans.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No saved meal plans yet. Start by generating your first
                    plan!
                  </div>
                ) : (
                  savedPlans.length > 3 && (
                    <Button
                      onClick={() => setShowPastPlans(!showPastPlans)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      {showPastPlans
                        ? "Show Less"
                        : `Show ${savedPlans.length - 3} More Plans`}
                    </Button>
                  )
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Generate New Plan Section */}
          <div className="backdrop-blur-sm bg-white/60 rounded-3xl p-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Create New Meal Plan
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <Select onValueChange={(value) => setDiet(value)} value={diet}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Diet" />
                </SelectTrigger>
                <SelectContent>
                  {dietaryOptions.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={generatePlan}
                disabled={isGenerating || !diet}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8"
              >
                {isGenerating ? "Generating..." : "Generate Plan"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.entries(customDishes).map(([mealType, value]) => (
                <div key={mealType} className="relative">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold capitalize bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                      Custom {mealType}
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleCustomDishChange(mealType, e.target.value)
                        }
                        placeholder={`Add your ${mealType} dish...`}
                        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      {suggestions[mealType].length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                          {suggestions[mealType].map((suggestion, index) => {
                            const lowerSuggestion = suggestion.toLowerCase();
                            const lowerInput =
                              customDishes[mealType].toLowerCase();
                            const startIndex =
                              lowerSuggestion.indexOf(lowerInput);

                            let parts = [];
                            if (startIndex >= 0) {
                              parts = [
                                suggestion.slice(0, startIndex),
                                suggestion.slice(
                                  startIndex,
                                  startIndex + lowerInput.length
                                ),
                                suggestion.slice(
                                  startIndex + lowerInput.length
                                ),
                              ];
                            }

                            return (
                              <div
                                key={index}
                                onClick={() =>
                                  handleSelectSuggestion(mealType, suggestion)
                                }
                                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-gray-700 flex items-center justify-between group"
                              >
                                <span>
                                  {startIndex >= 0 ? (
                                    <>
                                      {parts[0]}
                                      <span className="bg-emerald-100 font-medium">
                                        {parts[1]}
                                      </span>
                                      {parts[2]}
                                    </>
                                  ) : (
                                    suggestion
                                  )}
                                </span>
                                <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  Select
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {customDishes[mealType] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveCustomDish(customDishes[mealType])}
                        className="mt-2 text-emerald-600 hover:text-emerald-700"
                      >
                        Save for Future
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {mealPlan.breakfast && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {Object.entries(mealPlan).map(([mealType, dish]) => (
                    <Card
                      key={mealType}
                      className="transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold capitalize bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {mealType}
                          </h2>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                            {mealType === "breakfast" && "🌅"}
                            {mealType === "lunch" && "🌞"}
                            {mealType === "dinner" && "🌙"}
                            {mealType === "snacks" && "🍎"}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{dish}</p>
                        {mealImages[mealType] && (
                          <img
                            src={mealImages[mealType]}
                            alt={dish || mealType}
                            className="w-full h-32 object-cover rounded-lg mb-2 shadow"
                          />
                        )}
                        <div className="flex flex-col gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenImageUpload(mealType)}
                            className="w-full hover:bg-emerald-50"
                          >
                            Upload Image / Camera
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => replaceMeal(mealType)}
                          className="w-full hover:bg-emerald-50"
                        >
                          Replace
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={saveMealPlan}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-emerald-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Plan
                  </Button>
                  <Button
                    onClick={() => handleExport('json')}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-blue-50"
                  >
                    <FileJson className="w-4 h-4" />
                    Export JSON
                  </Button>
                  <Button
                    onClick={() => handleExport('text')}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-purple-50"
                  >
                    <FileText className="w-4 h-4" />
                    Export Text
                  </Button>
                  <Button
                    onClick={() => handleExport('pdf')}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-red-50"
                  >
                    <FileType className="w-4 h-4" />
                    Export PDF
                  </Button>
                </div>
              </>
            )}
            {isImageUploadOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">
                    Add Image for {selectedMealType}
                  </h3>
                  <ImageUpload onImageSelect={handleImageSelect} />
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsImageUploadOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
