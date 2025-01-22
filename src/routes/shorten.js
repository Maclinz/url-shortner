import express from "express";
import { customAlphabet } from "nanoid";
import ShortenLink from "../Models/ShortenLink.js";

const router = express.Router();

const generateShortUrl = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const shortUrl = customAlphabet(alphabet, 6);
  return shortUrl();
};

router.post("/shorten", async (req, res) => {
  try {
    const { url, email } = req.body;

    const shortUrl = generateShortUrl();

    const shortLink = new ShortenLink({
      url,
      shortUrl,
      email,
    });

    await shortLink.save();

    const fullShortUrl = `${process.env.CLIENT_URL}/${shortUrl}`;

    res.status(201).send({ ...shortLink.toObject(), fullShortUrl });
  } catch (error) {
    console.log("Error shortening URL: ", error);
    res.status(500).send("Internal server error occurred");
  }
});

// get all links
router.get("/all", async (req, res) => {
  try {
    // Get the total number of links
    const totalLinks = await ShortenLink.countDocuments();

    // Get the total click count
    const clickCountAggregation = await ShortenLink.aggregate([
      {
        $group: {
          _id: null, // Group everything together
          totalClicks: { $sum: "$clickCount" },
        },
      },
    ]);

    const totalClicks = clickCountAggregation[0]?.totalClicks || 0;

    res.status(200).send({
      totalLinks,
      totalClicks,
    });
  } catch (error) {
    console.error("Error getting all links: ", error);
    res.status(500).send("Internal server error occurred");
  }
});

router.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const link = await ShortenLink.findOne({ shortUrl });

    if (!link) {
      return res.status(404).send("Link not found");
    }

    // Increment the click count for the specific link
    link.clickCount = (link.clickCount || 0) + 1;
    await link.save();

    res.redirect(link.url);
  } catch (error) {
    console.log("Error redirecting to URL: ", error);
    res.status(500).send("Internal server error occurred");
  }
});

export default router;
