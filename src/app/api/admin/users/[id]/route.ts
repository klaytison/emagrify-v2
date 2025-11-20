import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRole) {
    throw new Error("Supabase config missing");
  }

  return createClient(supabaseUrl, serviceRole);
}

// Atualizar metadata: role, suspended
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    const updates: any = {};

    if (body.role !== undefined || body.suspended !== undefined) {
      updates.user_metadata = {};
      if (body.role !== undefined) updates.user_metadata.role = body.role;
      if (body.suspended !== undefined)
        updates.user_metadata.suspended = body.suspended;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nada para atualizar" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      params.id,
      updates
    );

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao atualizar usuário" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data.user });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

// Deletar usuário
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(params.id);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao deletar usuário" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
