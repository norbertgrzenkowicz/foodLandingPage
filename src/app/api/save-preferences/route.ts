import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const requestData = await request.json();

    // Extract dietary preferences
    const { dietGoals, allergies, customPreferences } = requestData;

    // Save to the database
    const { data, error } = await supabase.from("user_preferences").upsert(
      {
        user_id: user.id,
        diet_goals: dietGoals,
        allergies: allergies,
        custom_preferences: customPreferences,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Preferences saved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user preferences
    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGSQL_NO_ROWS_RETURNED") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      dietGoals: data?.diet_goals || [],
      allergies: data?.allergies || [],
      customPreferences: data?.custom_preferences || "",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
