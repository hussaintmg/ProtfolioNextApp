const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    skIcons: {
        type: [],
        default: [],
    },
    skList:{
        type: [
      {
        heading: String,
        list: String,
      },
    ],
    default: [],
    },
    services:{
        type: [
      {
        title: String,
        icon: String,
      },
    ],
    default: [],
    }
});
const Skills = mongoose.models.Skills || mongoose.model("Skills", skillSchema);
export default Skills;