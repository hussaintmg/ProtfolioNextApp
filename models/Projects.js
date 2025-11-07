import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectsArr: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true },
      images: { type: [String], default: [] },
      videos: { type: [String], default: [] },
    }
  ],
});

const Projects = mongoose.models.Projects || mongoose.model("Projects", projectSchema);

export default Projects;
