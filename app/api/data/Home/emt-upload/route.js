import { NextResponse } from "next/server";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  try {
    const { EmailT } = await req.json();
    const updated = await Home.findOneAndUpdate(
      {},
      { EmailT },
      { new: true, upsert: true }
    );
    return NextResponse.json({ EmailT: updated.EmailT }, { status: 200 });
  } catch (err) {
    console.error("Text upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
