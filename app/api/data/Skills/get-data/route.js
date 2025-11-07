import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const skillsData = await Skills.findOne();

    return NextResponse.json({
      skills: skillsData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
