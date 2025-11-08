import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectsArr: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true },
      images: [
        {
          icon: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      videos: [
        {
          video: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
    },
  ],
});

const Projects =
  mongoose.models.Projects || mongoose.model("Projects", projectSchema);

export default Projects;
