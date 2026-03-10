import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/setup
 * One-time admin account creation.
 * Creates a Supabase auth user + public.users profile with role='admin'.
 * Uses service role key — no auth required (but checks if admin already exists).
 *
 * Login ID "admin" is mapped to email "admin@contest.admin" internally.
 */
const ADMIN_EMAIL = "admin@contest.admin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, setup_key } = body;

    // Basic protection: require a setup key matching env or a default
    const expectedKey = process.env.ADMIN_SETUP_KEY || "setup-edu-ai-2026";
    if (setup_key !== expectedKey) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
    }

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const email = `${username}@contest.admin`;
    const admin = createAdminClient();

    // Check if admin user already exists in auth
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      // If reset_password flag is set, update the password
      if (body.reset_password) {
        const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
          password: password,
        });
        if (updateError) {
          return NextResponse.json({ error: "Password reset failed: " + updateError.message }, { status: 500 });
        }
      }

      // Make sure profile has admin role
      await admin.from("users").upsert({
        id: existing.id,
        email: email,
        name: username,
        role: "admin",
      }, { onConflict: "id" });

      return NextResponse.json({ 
        message: body.reset_password ? "Admin password reset successfully." : "Admin already exists. Role verified.", 
        email 
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Skip email verification
    });

    if (authError) {
      console.error("Admin user creation error:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Create profile in public.users with admin role
    const { error: profileError } = await admin.from("users").upsert({
      id: authData.user.id,
      email: email,
      name: username,
      role: "admin",
    }, { onConflict: "id" });

    if (profileError) {
      console.error("Admin profile creation error:", profileError.message);
      return NextResponse.json({ error: "Auth user created but profile failed: " + profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Admin account created successfully",
      login_id: username,
      email: email,
    }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/setup error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
