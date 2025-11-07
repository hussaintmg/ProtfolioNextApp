import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";

export async function POST(req) {
  await connectDB();

  try {
    const { heading, list } = await req.json();

    const savedData = await Skills.findOne();
    let lisaved = savedData?.skList || [];

    lisaved.push({ heading, list });

    const skillData = await Skills.findOneAndUpdate(
      {},
      { skList: lisaved },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Item uploaded successfully",
      list: skillData.skList,
    });
  } catch (error) {
    console.error("Error uploading skill list:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}