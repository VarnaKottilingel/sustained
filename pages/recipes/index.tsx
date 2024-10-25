"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Award } from "lucide-react";

type Recipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  calories: number;
  spoonacularScore: number;
  missedIngredientCount: number;
  usedIngredientCount: number;
};

type RecipeDetails = Recipe & {
  summary: string;
  instructions: string;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [visibleRecipes, setVisibleRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      const ingredientsParam = searchParams.get("ingredients");
      if (!ingredientsParam) {
        console.error("No ingredients provided");
        setLoading(false);
        return;
      }

      const ingredients = decodeURIComponent(ingredientsParam).split(",");
      const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

      if (!apiKey) {
        console.error("API key not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(",")}&number=5&apiKey=${apiKey}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();

        // Fetch detailed information for each recipe
        const detailedRecipes = await Promise.all(
          data.map(async (recipe: any) => {
            const detailResponse = await fetch(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`,
            );
            if (!detailResponse.ok) {
              throw new Error(
                `Failed to fetch details for recipe ${recipe.id}`,
              );
            }
            const detailData = await detailResponse.json();
            return {
              ...recipe,
              readyInMinutes: detailData.readyInMinutes,
              //calories: detailData.nutrition?.nutrients.find((n: any) => n.name === "Calories")?.amount || "N/A",
              spoonacularScore: detailData.spoonacularScore,
              summary: detailData.summary,
              instructions: detailData.instructions,
            };
          }),
        );

        setRecipes(detailedRecipes);
        setVisibleRecipes(detailedRecipes.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe as RecipeDetails);
  };

  const handleBackToIngredients = () => {
    router.push("/inventory");
  };

  const handleShowMore = () => {
    const currentLength = visibleRecipes.length;
    const newRecipes = recipes.slice(currentLength, currentLength + 5);
    setVisibleRecipes([...visibleRecipes, ...newRecipes]);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (selectedRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{selectedRecipe.title}</h1>
        <Image
          src={selectedRecipe.image}
          alt={selectedRecipe.title}
          width={400}
          height={400}
          className="rounded-lg mb-4 mx-auto"
        />
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}
        />
        <h2 className="text-2xl font-bold mb-2">Instructions</h2>
        <div
          dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
        />
        <Button className="mt-4" onClick={() => setSelectedRecipe(null)}>
          Back to Recipes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center p-4 max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="SustainedEats"
            width={100}
            height={50}
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
      </header>

      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Recipes for You</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => handleRecipeSelect(recipe)}
            >
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Award className="mr-1 h-4 w-4" />
                  <span className="mr-4">
                    {recipe.spoonacularScore.toFixed(1)} Score
                  </span>

                  <Clock className="mr-1 h-4 w-4" />
                  <span>{recipe.readyInMinutes} min</span>
                </div>
                <p className="text-sm text-gray-600">
                  Uses {recipe.usedIngredientCount} of{" "}
                  {recipe.usedIngredientCount + recipe.missedIngredientCount}{" "}
                  ingredients
                </p>
              </div>
            </div>
          ))}
        </div>
        {visibleRecipes.length < recipes.length && (
          <div className="text-center mt-8">
            <Button onClick={handleShowMore}>Show More</Button>
          </div>
        )}
      </main>

      <div className="text-center mt-8">
        <Button onClick={handleBackToIngredients}>Back to Ingredients</Button>
      </div>
    </div>
  );
}
