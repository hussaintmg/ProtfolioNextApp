import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";

export async function PUT(req, { params }) {
  await connectDB();
  const index = parseInt(params.index);

  try {
    const { heading, list } = await req.json();
    const skill = await Skills.findOne();

    if (!skill) {
      return NextResponse.json(
        { error: "No Skills document found" },
        { status: 404 }
      );
    }

    const i = parseInt(index);
    if (isNaN(i) || i < 0 || i >= skill.skList.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    skill.skList[i] = { heading, list };
    await skill.save();

    return NextResponse.json({
      message: "Updated successfully",
      list: skill.skList,
    });
  } catch (error) {
    console.error("Error updating skill list:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
