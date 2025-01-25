import aj from "../lib/arcjet.js";

const blockBots = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return res.status(403).send({ error: "Unauthorized Bot detected" });
      }
    }

    next();
  } catch (error) {
    console.error("Error blocking bots: ", error);
  }
};

export default blockBots;
