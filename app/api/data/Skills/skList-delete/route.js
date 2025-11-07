import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";

export async function DELETE(req) {
  await connectDB();

  try {
    const { index } = await req.json();
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
    
    skill.skList.splice(i, 1);
    await skill.save();

    return NextResponse.json({
      message: "List item deleted successfully",
      list: skill.skList,
    });
  } catch (error) {
    console.error("Error deleting list item:", error);
    return NextResponse.json(
      { error: "Failed to delete list item" },
      { status: 500 }
    );
  }
}
