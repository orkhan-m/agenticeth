import { useEffect, useState } from "react";
import styles from "./OpenAiItem.module.css";
import OpenAI from "openai";
import NftCard from "./nftCard";
import Button from "./Button";
import Spinner from "./Spinner";
import { useAll } from "../contexts/AllContext";
import axios from "axios";
import supabase from "../../supabase-client";

export default function OpenAiItem() {
  const [imageUrls, setImageUrls] = useState([]);
  const [nftHero, setNftHero] = useState("");
  const [nftFeature, setNftFeature] = useState("");
  const [nftAmount, setNftAmount] = useState(2);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(false);
  const [listFeatures, setListFeatures] = useState([]);

  const { logIn } = useAll();

  async function generateImage() {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      setIsImageLoading(true);
      const imgUrls = [];
      const ipfsUrls = [];

      for (const feature of listFeatures) {
        const response = await openai.images.generate({
          model: "dall-e-2",
          prompt: `Picture ${nftHero}, digital NFT portrait – 
          hyper-stylized cartoon with bold outlines, 
          vibrant colors, and trendy accessories with the features of ${feature}., 
          set against a minimalist background.`,
          n: 1,
          size: "512x512",
        });
        const imgUrl = response.data[0].url;
        imgUrls.push(imgUrl);

        try {
          const downloadResponse = await axios.get(
            `http://localhost:3001/download?url=${encodeURIComponent(imgUrl)}`
          );
          console.log(`Image ${feature} downloaded:`, downloadResponse.data);

          // Store IPFS URL
          if (downloadResponse.data.ipfsUrl) {
            ipfsUrls.push({
              feature,
              url: downloadResponse.data.ipfsUrl,
              hash: downloadResponse.data.ipfsHash,
            });
          }
        } catch (error) {
          console.error(`Error downloading image ${feature}:`, error);
        }
      }
      setImageUrls(imgUrls);
      // You can store or use ipfsUrls array as needed
      console.log("IPFS URLs:", ipfsUrls);
    } catch (error) {
      console.error("Failed to generate images:", error);
      alert("Failed to generate images. Please try again.");
    } finally {
      setIsImageLoading(false);
    }
  }

  async function generateFeatures() {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      setIsFeaturesLoading(true);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "developer",
            content:
              "You are a helpful assistant. You only give final result even if you do not understand how to approach it. You always provide something generated, and never plain 'feature'.",
          },
          {
            role: "user",
            content: `Generate variations of ${nftFeature}.
            As an example: if ${nftFeature} is "country", the variations could be "USA", "Canada", "Mexico", etc.,
            if ${nftFeature} is "planets", the variations could be "Mars", "Pluto", "Jupyter", etc.,
            Number of features must be equal to ${nftAmount}. The final result should be in following format (VERY IMPORTANT). 
            No additional text! Only the result which is in JavaScript list format, and nothing else. 
            "Features" should always be substituted with the feature result you generate based on input.
            DO NOT GIVE plain result like ["Feature 1", "Feature 2"] without any input from your end. See 
            If ${nftAmount}=2 then result always replace "Features" with the actual features you generate:
            ["Feature 1", "Feature 2"];

            If ${nftAmount}=3 then result always replace "Features" with the actual features you generate: 
            ["Feature 1", "Feature 2", "Feature 3"];

            If ${nftAmount}=4 then result always replace "Features" with the actual features you generate:
            ["Feature 1", "Feature 2", "Feature 3", "Feature 4"];

            If ${nftAmount}=5 then result always replace "Features" with the actual features you generate:
            ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"];`,
          },
        ],
        store: true,
      });
      const features = completion.choices[0].message.content;
      const featureAdjusted = features.slice(0, -1);
      const parsedFeatures = JSON.parse(featureAdjusted);
      setListFeatures(parsedFeatures);
    } catch {
      alert("Failed to generate features list. Please try again.");
    } finally {
      setIsFeaturesLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function inputNftHero(e) {
    setNftHero(e.target.value);
  }

  function inputNftFeature(e) {
    setNftFeature(e.target.value);
  }

  function handleNftAmountChange(e) {
    setNftAmount(parseInt(e.target.value));
  }

  return (
    <div className={styles.generateCollectionContainer}>
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <div className={styles.inputNftCharacter}>
          <label>NFT Hero:</label>
          <input type="text" value={nftHero} onChange={inputNftHero} />
          <p>e.g., cat, dog, penguin, etc.</p>
        </div>
        <div className={styles.inputNftFeatures}>
          <label>NFT Hero Features:</label>
          <input type="text" value={nftFeature} onChange={inputNftFeature} />
          <p>e.g., country, professions, etc.</p>
        </div>
        <div className={styles.inputNftNumber}>
          <label>Number of NFTs in Collection:</label>
          <div className={styles.selectNftNumber}>
            <label className={styles.inlineLabel}>
              <input
                type="radio"
                name="nftNumber"
                value="2"
                checked={nftAmount === 2}
                onChange={handleNftAmountChange}
              />
              2
            </label>
            <label>
              <input
                type="radio"
                name="nftNumber"
                value="3"
                checked={nftAmount === 3}
                onChange={handleNftAmountChange}
              />
              3
            </label>
            <label>
              <input
                type="radio"
                name="nftNumber"
                value="4"
                checked={nftAmount === 4}
                onChange={handleNftAmountChange}
              />
              4
            </label>
            <label>
              <input
                type="radio"
                name="nftNumber"
                value="5"
                checked={nftAmount === 5}
                onChange={handleNftAmountChange}
              />
              5
            </label>
          </div>
          <p>Only available options: 2-5</p>
        </div>
      </form>
      <div className={styles.baseImageContainer}>
        <div className={styles.generateBaseButtonAndFeatures}>
          <Button
            isDisabled={!(logIn && nftHero !== "" && nftFeature !== "")}
            handleClick={generateFeatures}
          >
            Generate Features
          </Button>
          <label>Features:</label>
          {isFeaturesLoading ? (
            <Spinner />
          ) : (
            <ul>
              {listFeatures && listFeatures.length > 0 ? (
                listFeatures.map((feature, index) => (
                  <li className={styles.featureListed} key={index}>
                    {feature}
                  </li>
                ))
              ) : (
                <li className={styles.featureListed}></li>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.generateButtonContainer}>
        <Button
          isDisabled={!(logIn && nftHero !== "" && nftFeature !== "")}
          handleClick={generateImage}
        >
          Generate Collection
        </Button>
      </div>
      <h2 className={styles.cardCanvasTitle}>NFT Workspace</h2>
      <div className={styles.cardCanvas}>
        {isImageLoading ? (
          <Spinner />
        ) : (
          imageUrls.map((url, index) => <NftCard key={index} imageUrl={url} />)
        )}
      </div>
    </div>
  );
}
