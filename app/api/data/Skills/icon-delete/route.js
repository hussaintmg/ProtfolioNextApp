import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import fs from "fs";
import path from "path";

export async function DELETE(req) {
  await connectDB();
  try {
    const { iconPath } = await req.json();

    if (!iconPath) {
      return NextResponse.json({ error: "Icon path missing" }, { status: 400 });
    }

    const absolutePath = path.join(process.cwd(), "public", iconPath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    } else {
      console.warn("File not found:", absolutePath);
    }

    const updatedSkills = await Skills.findOneAndUpdate(
      {},
      { $pull: { skIcons: iconPath } },
      { new: true }
    );

    return NextResponse.json({
      message: "Icon deleted successfully",
      updatedSkills,
    });
  } catch (error) {
    console.error("Error deleting icon:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
