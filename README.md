## PumpNFT

The idea of the project is to give users opportunity to create their
own NFT collection in a few clicks without a need to create Art,
the task of generating and art is done by an AI. AI is designed to
create a collection which will use a "character" provided by the
user as a base image, and "features" provided by the user as a
variation of the collection images.

### How to run a project?

#### Client:

```
cd client
npm i
npm run dev
```

#### Server:

```
cd server
npm i
npm run dev
```

##### Client .env:

VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY

##### Server .env:

PINATA_API_KEY=YOUR_PINATA_API_KEY\
PINATA_SECRET_KEY=YOUR_PINATA_SECRET_KEY
