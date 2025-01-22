import mongoose from "mongoose";

const ShortenLinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    shortUrl: {
      type: String,
      required: true,
    },

    clickCount: {
      type: Number,
      default: 0,
    },

    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ShortenLink = mongoose.model("ShortenLink", ShortenLinkSchema);

export default ShortenLink;
