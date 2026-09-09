import { NextResponse } from "next/server";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Deleting a Supabase Auth user requires the service-role key: the signed-in
// user's own session can never do this (by design), so it has to run here,
// server-side, via the admin API. Set SUPABASE_SERVICE_ROLE_KEY (server-only,
// no NEXT_PUBLIC_ prefix) in the environment for this route to work.
export async function POST() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Account deletion isn't configured on this deployment yet. An admin needs to set SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }

  const admin = createSupabaseJsClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: deleteChecksError } = await admin.from("saved_checks").delete().eq("user_id", user.id);
  if (deleteChecksError) {
    return NextResponse.json({ error: deleteChecksError.message }, { status: 500 });
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteUserError) {
    return NextResponse.json({ error: deleteUserError.message }, { status: 500 });
  }

  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
