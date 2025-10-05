import React from 'react';
import StarRating from './StarRating'; // <-- This line is new

// The component now accepts the 'onRate' function
const RecipeModal = ({ recipe, isOpen, onClose, onSave, onRate }) => {
  if (!isOpen || !recipe) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-1 transition-colors duration-200"
            aria-label="Close modal"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-3xl font-bold mb-4 text-gray-800">{recipe.name}</h2>

        <div className="prose max-w-none mb-6">
            <img src={recipe.image} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-4 shadow-md" />
            <p><strong>Category:</strong> {recipe.category}</p>
            <p><strong>Cuisine:</strong> {recipe.cuisines?.join(', ')}</p>
        </div>

        {/* --- THIS IS THE NEW RATING SECTION --- */}
        <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Enjoyed this meal?</h3>
            <p className="text-gray-600 mb-4">Let us know by leaving a rating!</p>
            <StarRating onRate={onRate} />
        </div>
        {/* --- END OF NEW RATING SECTION --- */}

        <div className="flex justify-end mt-6">
          <button onClick={() => onSave(recipe)} className="px-5 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-sm">
            Save to Favorites
          </button>
        </div>
      </div>
    </div>
  );
};
export default RecipeModal;
