import { useEffect, useState } from "react";
import styles from "./OpenAiItem.module.css";
import OpenAI from "openai";
import NftCard from "./nftCard";
import Button from "./Button";
import Spinner from "./Spinner";
import { useAll } from "../contexts/AllContext";
import axios from "axios";

export default function OpenAiItem() {
  const [imageUrl, setImageUrl] = useState("");
  const [nftHero, setNftHero] = useState("");
  const [nftFeature, setNftFeature] = useState("");
  const [nftAmount, setNftAmount] = useState(2);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(false);
  const [listFeatures, setListFeatures] = useState([]);

  const { logIn } = useAll();

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // async function sendRequest() {
  //   const openai = new OpenAI({
  //     apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  //     dangerouslyAllowBrowser: true,
  //   });

  //   const completion = await openai.chat.completions.create({
  //     model: "gpt-4o-mini",
  //     messages: [
  //       { role: "system", content: "You are a helpful assistant." },
  //       {
  //         role: "user",
  //         content: "Write a haiku about recursion in programming.",
  //       },
  //     ],
  //     store: true,
  //   });
  //   console.log(completion.choices[0].message);
  //   return completion.choices[0].message;
  // }

  async function generateImage() {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      setIsImageLoading(true);
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: `${nftHero}, digital non fungable token portrait -
        plain colors, and no accessories,
        set against a minimalist background.
        There should be no text or lettering in the image.`,
        n: 1,
        size: "512x512",
      });
      const imgUrl = await response.data[0].url;
      setImageUrl(imgUrl);
    } catch {
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsImageLoading(false);
    }

    try {
      setIsFeaturesLoading(false);

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

      console.log(features);
      console.log(featureAdjusted);
      console.log(parsedFeatures);

      setListFeatures(parsedFeatures);
    } catch {
      alert("Failed to generate features list. Please try again.");
    } finally {
      setIsFeaturesLoading(false);
    }
  }

  async function downloadImage(url) {
    const image = await fetch(url);
  }

  // useEffect(() => {
  //   generateImage();
  // }, []);

  // sendRequest();
  // generateImage();
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
        <div className={styles.baseImageAndLabel}>
          <label>Base Image</label>
          {isImageLoading ? (
            <Spinner />
          ) : (
            <img
              className={styles.baseImage}
              src={imageUrl ? imageUrl : "/placeholder.jpg"}
              alt="Base Image"
            />
          )}
        </div>
        <div className={styles.generateBaseButtonAndFeatures}>
          <Button
            isDisabled={!(logIn && nftHero !== "" && nftFeature !== "")}
            handleClick={generateImage}
          >
            Generate Base Image
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
                <li></li>
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
        <NftCard imageUrl="1.png" />
        <NftCard imageUrl="2.png" />
        <NftCard imageUrl="2.png" />
        <NftCard imageUrl="3.png" />
        <NftCard imageUrl="3.png" />
      </div>

      {/* {imageUrl ? (
        <img src={imageUrl} alt="Generated by OpenAI" />
      ) : (
        <p>Loading...</p>
      )} */}
    </div>
  );
}
