import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { title, icon } = await req.json();

    const savedData = await Skills.findOne();
    const saved = savedData?.services || [];

    saved.push({ title, icon });

    const skillData = await Skills.findOneAndUpdate(
      {},
      { services: saved },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Item uploaded successfully",
      services: skillData.services,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
