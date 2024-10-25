"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Category = {
  name: string;
  image: string;
};

type Ingredient = {
  name: string;
  image: string;
};

type Ingredients = {
  [key: string]: Ingredient[];
};

const categories: Category[] = [
  { name: "Fruits", image: "/fruits.jpg" },
  { name: "Vegetables", image: "/vegetables.jpg" },
  { name: "Meat and Seafood", image: "/meat.jpg" },
  { name: "Dairy", image: "/dairy.jpg" },
  { name: "Grains and Legumes", image: "/grains.jpg" },
];

const ingredients: Ingredients = {
  Fruits: [
    { name: "Banana", image: "/images/banana.jpg" },
    { name: "Apple", image: "/images/apple.jpg" },
    { name: "Orange", image: "/images/orange.jpg" },
    { name: "Strawberry", image: "/images/strawberry.jpg" },
    { name: "Avocado", image: "/images/avocado.jpg" },
    { name: "Blueberry", image: "/images/blueberry.jpg" },
    { name: "Watermelon", image: "/images/watermelon.jpg" },
  ],
  Vegetables: [
    { name: "Broccoli", image: "/images/broccoli.jpg" },
    { name: "Carrot", image: "/images/carrot.jpg" },
    { name: "Tomato", image: "/images/tomato.jpg" },
    { name: "Cucumber", image: "/images/cucumber.jpg" },
    { name: "Peppers", image: "/images/peppers.jpg" },
    { name: "Potato", image: "/images/potato.jpg" },
    { name: "Zucchini", image: "/images/zucchini.jpg" },
  ],
    'Meat and Seafood': [
    { name: "Chicken", image: "/images/chicken.jpg" },
    { name: "Eggs", image: "/images/eggs.jpg" },
    { name: "Salmon", image: "/images/salmon.jpg" }
    ],
    Dairy: [
    { name: "Milk", image: "/images/milk.jpg" },
    { name: "Yogurt", image: "/images/yogurt.jpg" },
    { name: "Cheese", image: "/images/cheese.jpg" },
    ],
    'Grains and Legumes': [
    { name: "Rice", image: "/images/rice.jpg" },
    { name: "Flour", image: "/images/flour.jpg" },
    ],
  // Add more ingredients for other categories
};

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Fruits");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleIngredientSelect = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient],
    );
  };
  const handleShowRecipes = () => {
    const ingredientsParam = encodeURIComponent(selectedIngredients.join(","));
    router.push(`/recipes?ingredients=${ingredientsParam}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {" "}
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="SustainedEats"
            width={100}
            height={200}
          />
          <span className="text-xl font-semibold">SustainedEats</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a className="text-gray-600 hover:text-gray-900" href="/">
            Home
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="#">
            How it Works
          </a>

          <a className="text-gray-600 hover:text-gray-900" href="#">
            FAQ
          </a>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </header>
      <h1 className="text-3xl font-bold mb-6 text-center"></h1>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Let's see what you have got!
      </h1>
      <h2 className="text-2xl font mb-6 text-center">
        Pick the ingredients what you have in your pantry right now, and we'll
        whip up some exciting recipes for you.
      </h2>
      <div className="flex justify-center mb-8 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`px-3 py-2 mx-1 text-sm md:text-base whitespace-nowrap ${
              selectedCategory === category.name
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-500"
            }`}
            onClick={() => handleCategorySelect(category.name)}
          >
            {category.name.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols- lg:grid-cols-4 gap-6">
        {ingredients[selectedCategory]?.map((ingredient) => (
          <div
            key={ingredient.name}
            className={`cursor-pointer transition-all duration-200 ${
              selectedIngredients.includes(ingredient.name) ? "scale-105" : ""
            }`}
            onClick={() => handleIngredientSelect(ingredient.name)}
          >
            <div className="relative h-40 w-40 mx-auto mb-2">
              <Image
                src={ingredient.image}
                alt={ingredient.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
              {selectedIngredients.includes(ingredient.name) && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-50 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-center">{ingredient.name}</p>
          </div>
        ))}
      </div>
      {selectedIngredients.length > 0 && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Selected Ingredients:</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
          <Link href="/recipes">
            <Button size="lg" onClick={handleShowRecipes}>
              Show me my recipes
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
