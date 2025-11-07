import connectDB from "@/lib/mongodb";
import Home from "@/models/Home";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const homeData = await Home.findOne();

    return NextResponse.json({
      home: homeData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
