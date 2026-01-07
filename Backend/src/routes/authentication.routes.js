const router = require("express").Router();
const controller = require("../controllers/authHandler");
const auth = require("../middleware/tokenVerification");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", auth.verifyToken, controller.me);

module.exports = router;
