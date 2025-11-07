import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  await connectDB();

  try {
    const { index } = await req.json();

    if (index === undefined) {
      return NextResponse.json(
        { error: "Index is required" },
        { status: 400 }
      );
    }

    const skillData = await Skills.findOne();

    if (!skillData || !skillData.services[index]) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    skillData.services.splice(index, 1);
    await skillData.save();

    return NextResponse.json({
      message: "Service deleted successfully",
      services: skillData.services,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
