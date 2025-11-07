import { NextResponse } from "next/server";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  try {
    const { FOI, FOL } = await req.json();
    const homeData = await Home.findOne();
    let FOsaved = homeData?.FO || [];
    FOsaved.push({ FOI, FOL });

    const updated = await Home.findOneAndUpdate(
      {},
      { FO: FOsaved },
      { new: true, upsert: true }
    );
    return NextResponse.json({ FO: updated.FO }, { status: 200 });
  } catch (err) {
    console.error("Text upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
