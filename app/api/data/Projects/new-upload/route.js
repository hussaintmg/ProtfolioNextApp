import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import { uploadFile } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const link = formData.get("link");

    if (!title)
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    if (!link)
      return NextResponse.json(
        { message: "Link is required" },
        { status: 400 }
      );

    const images = [];
    const videos = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === "images[]") {
          // Convert image to buffer
          const buffer = Buffer.from(await value.arrayBuffer());
          const result = await uploadFile(
            buffer,
            "projects/images",
            null,
            "image"
          );
          images.push({
            icon: result.url,
            public_id: result.publicId,
          });
        }

        if (key === "videos[]") {
          // Use stream for videos
          const result = await uploadFile(
            value.stream(),
            "projects/videos",
            null,
            "video"
          );
          videos.push({
            video: result.url,
            public_id: result.publicId,
          });
        }
      }
    }

    const newProject = { title, link, images, videos };
    let projectDoc = await Projects.findOne();

    if (projectDoc) {
      projectDoc.projectsArr.push(newProject);
      await projectDoc.save();
    } else {
      projectDoc = await Projects.create({ projectsArr: [newProject] });
    }

    const lastProject =
      projectDoc.projectsArr[projectDoc.projectsArr.length - 1];
    lastProject.images.forEach((img) => (img.iconProjectId = lastProject._id));
    lastProject.videos.forEach((vid) => (vid.videoProjectId = lastProject._id));

    await projectDoc.save();

    return NextResponse.json(
      { message: "Project added successfully", project: lastProject },
      { status: 201 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
