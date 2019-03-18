import express from "express";

const router = express();

router.get("/hello-world", function(req, res) {
  res.json({ data: "Hello World!" });
});

export default router;
