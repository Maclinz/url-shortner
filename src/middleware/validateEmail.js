import aj from "../lib/arcjet.js";

const validateEmail = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      email: req.body.email,
    });

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        return res.status(400).send({ error: "Invalid email address" });
      }
    }

    next();
  } catch (error) {
    console.error("Error validating email: ", error);
  }
};

export default validateEmail;
