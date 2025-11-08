import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";

export const dynamic = "force-dynamic";

export async function PUT(req, context) {
  await connectDB();
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { link } = body;

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Link is required" },
        { status: 400 }
      );
    }

    const projectsDoc = await Projects.findOne({ "projectsArr._id": id });
    if (!projectsDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === id
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found in array" },
        { status: 404 }
      );
    }

    projectsDoc.projectsArr[projectIndex].link = link;
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      project: projectsDoc.projectsArr[projectIndex],
    });
  } catch (err) {
    console.error("Update Link Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
