import arcjet, {
  tokenBucket,
  shield,
  detectBot,
  validateEmail,
} from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    shield({ mode: "DRY_RUN" }),

    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),

    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 5, // refill 5 tokens per interval
      interval: 10, // refill every 10 seconds
      capacity: 75, // bucket maximum capacity of 20 tokens
    }),

    validateEmail({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // block disposable, invalid, and email addresses with no MX records
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

const protect = async (req, res, next) => {
  try {
    //apply rate limit
    const decision = await aj.protect(req, {
      requested: 5,
      email: req.body.email,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).send({ error: "Rate limit exceeded" });
      }

      if (decision.reason.isBot()) {
        return res.status(403).send({ error: "Unauthorized Bot detected" });
      }

      if (decision.reason.isShield()) {
        return res.status(403).send({ error: "Unauthorized request detected" });
      }

      if (decision.reason.isEmail()) {
        return res.status(400).send({ error: "Invalid email address" });
      }
    }

    next();
  } catch (error) {
    console.error("Error getting link: ", error);
  }
};

export default protect;
