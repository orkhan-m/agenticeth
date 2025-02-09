import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import pinataSDK from "@pinata/sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Pinata with API key and secret
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Test Pinata connection
pinata
  .testAuthentication()
  .then((result) => {
    console.log("Pinata Authentication:", result);
  })
  .catch((err) => {
    console.error("Pinata Authentication Error:", err);
    console.log("API Key:", process.env.PINATA_API_KEY ? "Present" : "Missing");
    console.log(
      "Secret Key:",
      process.env.PINATA_SECRET_KEY ? "Present" : "Missing"
    );
  });

app.get("/download", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    console.log("Received URL:", imageUrl);

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
    console.log("Saving to:", filePath);

    // Download image with error handling
    try {
      const response = await axios({
        method: "get",
        url: imageUrl,
        responseType: "stream",
        timeout: 10000, // 10 second timeout
      });

      const writer = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", (err) => {
          console.error("File write error:", err);
          reject(err);
        });
      });

      console.log("File saved successfully");

      // Verify file exists and has content
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      // Upload to IPFS via Pinata
      const readStream = fs.createReadStream(filePath);
      console.log("Uploading to Pinata...");

      const result = await pinata.pinFileToIPFS(readStream, {
        pinataMetadata: {
          name: fileName,
        },
      });

      console.log("Pinata upload result:", result);

      return res.json({
        success: true,
        message: "Image downloaded and uploaded to IPFS successfully",
        path: filePath,
        ipfsHash: result.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      });
    } catch (downloadError) {
      console.error("Download/Upload error:", downloadError);
      // Clean up the file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw downloadError;
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Failed to process image",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
