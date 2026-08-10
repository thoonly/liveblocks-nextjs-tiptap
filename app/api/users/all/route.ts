import { NextResponse } from "next/server";
import { getAllUsers } from "../../database";

/**
 * Returns every user ID
 * For the avatar stack, which renders members rather than room presence
 */

export async function GET() {
  return NextResponse.json(getAllUsers().map((user) => user.id));
}
