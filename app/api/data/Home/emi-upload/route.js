import { NextResponse } from "next/server";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";
import { uploadFile } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const file = formData.get("EMI");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const oldData = await Home.findOne();
    const oldPublicId = oldData?.EmailIconPublicId || null;

    const { url, publicId } = await uploadFile(buffer, "email-icons", oldPublicId);

    const homeData = await Home.findOneAndUpdate(
      {},
      { EmailIcon: url, EmailIconPublicId: publicId },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Icon uploaded successfully",
      EmailIcon: homeData.EmailIcon,
    });
  } catch (err) {
    console.error("Icon upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
