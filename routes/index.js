// Basic router just pointing to the API routes. If this were part of a larger web app there may be other routes to accommodate
const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

module.exports = router;
