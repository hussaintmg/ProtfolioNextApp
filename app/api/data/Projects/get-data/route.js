import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const projectsData = await Projects.findOne();

    return NextResponse.json({
      projects: projectsData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
