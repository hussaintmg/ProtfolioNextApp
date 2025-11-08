import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  logo: { type: String },
  logoPublicId: { type: String },
  Profile: { type: String },
  ProfilePublicId: { type: String },
  welText: { type: String },
  MSB: { type: String },
  MS: { type: String },
  FO: [
    {
      FOI: String,
      FOL: String,
    },
  ],
  EmailIcon: { type: String },
  EmailIconPublicId: { type: String },
  EmailT: { type: String },
  PhoneI: { type: String },
  PhoneIPublicId: { type: String },
  PhoneN: { type: String },
  AddressI: { type: String },
  AddressIPublicId: { type: String },
  AddressT: { type: String },
  socials: [
    {
      title: String,
      link: String,
      icon: String,
      iconPublicId: String,
      colour: String,
      shape: String,
    },
  ],
});

const Home = mongoose.models.Home || mongoose.model("Home", homeSchema);
export default Home;
