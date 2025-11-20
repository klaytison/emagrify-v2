import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRole) {
    throw new Error("Supabase config missing");
  }

  return createClient(supabaseUrl, serviceRole);
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users: data.users });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
