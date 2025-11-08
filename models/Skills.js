const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  skIcons: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    default: [],
  },
  skList: {
    type: [
      {
        heading: String,
        list: String,
      },
    ],
    default: [],
  },
  services: {
    type: [
      {
        title: String,
        icon: String,
      },
    ],
    default: [],
  },
});
const Skills = mongoose.models.Skills || mongoose.model("Skills", skillSchema);
export default Skills;
