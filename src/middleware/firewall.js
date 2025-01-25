import arcjet, { shield } from "@arcjet/node";

const aj = arcjet({
  // Get your site key from https://app.arcjet.com
  // and set it as an environment variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    // DRY_RUN mode logs only. Use "LIVE" to block
    shield({
      mode: "DRY_RUN",
    }),
  ],
});

const firewall = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    for (const result of decision.results) {
      console.log("Rule Result", result);
    }

    console.log("Conclusion", decision.conclusion);

    if (decision.isDenied()) {
      if (decision.reason.isShield()) {
        return res.status(403).send({ error: "Unauthorized request detected" });
      }
    }

    next();
  } catch (error) {
    console.error("Error blocking bots: ", error);
  }
};

export default firewall;
