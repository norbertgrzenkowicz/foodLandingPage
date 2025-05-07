"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import PhotoUpload from "@/components/PhotoUpload";

interface DietaryPreferencesFormProps {
  initialPreferences?: {
    dietGoals: string[];
    allergies: string[];
    customPreferences: string;
  };
}

export function DietaryPreferencesForm({
  initialPreferences,
}: DietaryPreferencesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [dietGoals, setDietGoals] = useState<string[]>(
    initialPreferences?.dietGoals || [],
  );
  const [allergies, setAllergies] = useState<string[]>(
    initialPreferences?.allergies || [],
  );
  const [customPreferences, setCustomPreferences] = useState(
    initialPreferences?.customPreferences || "",
  );

  const handleDietGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setDietGoals([...dietGoals, goal]);
    } else {
      setDietGoals(dietGoals.filter((item) => item !== goal));
    }
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    if (checked) {
      setAllergies([...allergies, allergy]);
    } else {
      setAllergies(allergies.filter((item) => item !== allergy));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dietGoals,
          allergies,
          customPreferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save preferences");
      }

      setSuccess("Preferences saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Diet Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="keto"
              checked={dietGoals.includes("keto")}
              onCheckedChange={(checked) =>
                handleDietGoalChange("keto", checked === true)
              }
            />
            <label
              htmlFor="keto"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keto
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paleo"
              checked={dietGoals.includes("paleo")}
              onCheckedChange={(checked) =>
                handleDietGoalChange("paleo", checked === true)
              }
            />
            <label
              htmlFor="paleo"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Paleo
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegan"
              checked={dietGoals.includes("vegan")}
              onCheckedChange={(checked) =>
                handleDietGoalChange("vegan", checked === true)
              }
            />
            <label
              htmlFor="vegan"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Vegan
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vegetarian"
              checked={dietGoals.includes("vegetarian")}
              onCheckedChange={(checked) =>
                handleDietGoalChange("vegetarian", checked === true)
              }
            />
            <label
              htmlFor="vegetarian"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Vegetarian
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowCarb"
              checked={dietGoals.includes("lowCarb")}
              onCheckedChange={(checked) =>
                handleDietGoalChange("lowCarb", checked === true)
              }
            />
            <label
              htmlFor="lowCarb"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Low Carb
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowFat"
              checked={dietGoals.includes("lowFat")}
              onCheckedChange={(checked) =>
                handleDietGoalChange("lowFat", checked === true)
              }
            />
            <label
              htmlFor="lowFat"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Low Fat
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Allergies & Sensitivities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gluten"
              checked={allergies.includes("gluten")}
              onCheckedChange={(checked) =>
                handleAllergyChange("gluten", checked === true)
              }
            />
            <label
              htmlFor="gluten"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Gluten
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dairy"
              checked={allergies.includes("dairy")}
              onCheckedChange={(checked) =>
                handleAllergyChange("dairy", checked === true)
              }
            />
            <label
              htmlFor="dairy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Dairy
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nuts"
              checked={allergies.includes("nuts")}
              onCheckedChange={(checked) =>
                handleAllergyChange("nuts", checked === true)
              }
            />
            <label
              htmlFor="nuts"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nuts
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="soy"
              checked={allergies.includes("soy")}
              onCheckedChange={(checked) =>
                handleAllergyChange("soy", checked === true)
              }
            />
            <label
              htmlFor="soy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Soy
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shellfish"
              checked={allergies.includes("shellfish")}
              onCheckedChange={(checked) =>
                handleAllergyChange("shellfish", checked === true)
              }
            />
            <label
              htmlFor="shellfish"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Shellfish
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="eggs"
              checked={allergies.includes("eggs")}
              onCheckedChange={(checked) =>
                handleAllergyChange("eggs", checked === true)
              }
            />
            <label
              htmlFor="eggs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Eggs
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-lg">Custom Preferences</h3>
        <Input
          placeholder="Enter any additional ingredients or preferences"
          value={customPreferences}
          onChange={(e) => setCustomPreferences(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
}

export function PhotoUploadSection() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageCapture = (file: File, preview: string) => {
    setUploadedImage(file);
    setImagePreview(preview);
    // In a future implementation, we would send the image to an API for analysis
    // For now, we'll simulate the analysis with a timeout
    setIsAnalyzing(true);
    setError(null);

    // Simulate API call with timeout
    setTimeout(() => {
      setIsAnalyzing(false);
      // Mock analysis result
      setAnalysisResult({
        safe: ["Water", "Salt", "Organic Cane Sugar"],
        moderate: ["Natural Flavors", "Citric Acid"],
        harmful: ["Red Dye 40", "High Fructose Corn Syrup"],
        matches: ["Sugar"],
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PhotoUpload onImageCapture={handleImageCapture} />

      {isAnalyzing && (
        <div className="text-center p-4">
          <div className="animate-pulse text-primary font-medium">
            Analyzing ingredients...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {analysisResult && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg">Analysis Results</h3>

          {analysisResult.matches && analysisResult.matches.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-amber-600">
                Matches with Your Preferences
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.matches.map((item: string, i: number) => (
                  <li key={i} className="text-amber-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.safe && analysisResult.safe.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Safe Ingredients</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.safe.map((item: string, i: number) => (
                  <li key={i} className="text-green-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.moderate && analysisResult.moderate.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-amber-600">Moderate Concern</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.moderate.map((item: string, i: number) => (
                  <li key={i} className="text-amber-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.harmful && analysisResult.harmful.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Harmful Ingredients</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResult.harmful.map((item: string, i: number) => (
                  <li key={i} className="text-red-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
