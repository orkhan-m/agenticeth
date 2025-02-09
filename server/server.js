import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing image URL" });
    }

    const timestamp = Date.now();
    const fileName = `image_${timestamp}.png`;
    const imagesDir = path.join(__dirname, "images");

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filePath = path.join(imagesDir, fileName);

    const response = await axios({
      method: "get",
      url: imageUrl,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        res.json({
          success: true,
          message: "Image downloaded successfully",
          path: filePath,
        });
        resolve();
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download image" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
