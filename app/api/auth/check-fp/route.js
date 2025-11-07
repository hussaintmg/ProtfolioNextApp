import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.FP_SECRET;

export async function GET(req) {
  try {
    const token = req.cookies.get("fp_token")?.value;
    if (!token) return NextResponse.json({ valid: false });

    jwt.verify(token, SECRET); // verify token validity
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
