import { NextResponse } from "next/server";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";
import { uploadFile } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const file = formData.get("Prof");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const oldData = await Home.findOne();
    const oldPublicId = oldData?.ProfilePublicId || null;

    const { url, publicId } = await uploadFile(buffer, "profiles", oldPublicId);

    const homeData = await Home.findOneAndUpdate(
      {},
      { Profile: url, ProfilePublicId: publicId },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Profile uploaded successfully",
      Profile: homeData.Profile,
    });
  } catch (err) {
    console.error("Profile upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
