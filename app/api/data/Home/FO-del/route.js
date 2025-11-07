import { NextResponse } from "next/server";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();

  try {
    const { index } = await req.json();
    const homeData = await Home.findOne();

    if (!homeData) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    if (index < 0 || index >= homeData.FO.length) {
      return NextResponse.json({ message: "Invalid index" }, { status: 400 });
    }

    homeData.FO.splice(index, 1);
    await homeData.save();

    return NextResponse.json(
      { message: "Item deleted successfully", FO: homeData.FO },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
