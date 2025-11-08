import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { NextResponse } from "next/server";

export async function PUT(req, {params}) {
  await connectDB();

  try {
    const indexParam = parseInt(params.index);

    if (indexParam === undefined) {
      return NextResponse.json(
        { error: "Missing index parameter in URL" },
        { status: 400 }
      );
    }

    const index = Number(indexParam);
    if (isNaN(index)) {
      return NextResponse.json(
        { error: "Invalid index parameter" },
        { status: 400 }
      );
    }

    const { title, icon } = await req.json();

    if (!title || !icon) {
      return NextResponse.json(
        { error: "Both title and icon are required" },
        { status: 400 }
      );
    }

    const skillData = await Skills.findOne();
    if (!skillData) {
      return NextResponse.json(
        { error: "No Skills data found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(skillData.services)) {
      skillData.services = [];
    }

    if (index < 0 || index >= skillData.services.length) {
      return NextResponse.json(
        { error: "Invalid index: out of range" },
        { status: 400 }
      );
    }

    skillData.services[index].title = title;
    skillData.services[index].icon = icon;

    await skillData.save();

    return NextResponse.json({
      message: "Service updated successfully",
      services: skillData.services,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}
