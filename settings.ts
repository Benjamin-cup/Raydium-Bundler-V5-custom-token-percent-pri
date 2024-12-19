import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { UserToken } from './src/types';

// **************************************************** //
// ***************   SETTINGS   *********************** //
// **************************************************** //
// SD, You should set following values before you run the program.

// settings about token you are going to Mint
export const tokens: UserToken[] = [
  {
    name: 'Hello',
    symbol: 'Hello',
    decimals: 9,
    description: "Hello, World!",
    uiAmount: 10 ** 9,
    image: "./src/images/1.jpg",
    extensions: {
      website: "https://www.soldev.app/",
      twitter: "https://x.com/mklrwt013",
      telegram: "https://t.me/Tiffanystones"
    },
    tags: [
      "Meme",
      "Tokenization"
    ],
    creator: {
      name: "",
      site: "https://www.soldev.app/"
    }
  }
]

// Main wallet to create token and pool, and so on
export const LP_wallet_private_key = "";
export const LP_wallet_keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(LP_wallet_private_key)));

// amount of baseToken to put into the pool (0.5 is 50%, 1 is 100%)
export const input_baseMint_tokens_percentage = 1 //ABC-Mint amount of tokens you want to add in Lp e.g. 1 = 100%. 0.9= 90%

// amount of Sol to put into the Pool as liquidity
export let quote_Mint_amount = 0.01; //COIN-SOL, amount of SOL u want to add to Pool amount

// amount of Sol to bundle buy with three wallets (0.01 is 0.01sol)
export const swapSolAmount: number[] = [0.00111111111111111111111111111111, 0.0001374828146481689788776402949619, 0.0001409277143318360831319775233113, 0.0001445037347647085096935732620723, 0.0001482176157983809246623333225621, 0.0001520765359730133274346070895315, 0.0001560881472336923360719708257064, 0.0001602606128949595797387788067600, 0.0001646026492047202822829338723578, 0.0001691235709058250519661721575216, 0.0001738333412348496378137118606863, 0.0001787480139728427379659955979296, 0.0001838574712592247725825276088214, 0.0001892427213561779505108398731089, 0.0001947496825759042657536820214398, 0.0002006164396053327155655178364450, 0.0002067125192618483857631450370203, 0.0002131134426686651445701239172491, 0.0002197461062129831845920173995883, 0.0002267657839293150432346237640356, 0.0002341023239976164131085972850678];

// number of wallets in each transaction
export const batchSize = 7

// number of wallets to bundle buy
export const bundleWalletNum = batchSize * 3

// name of file to save bundler wallets
export const bundlerWalletName = "wallets"

// percent of LP tokens to burn
export const burnLpQuantityPercent = 70   // 70 is 70% of total lp token supply

// whether you distribute the sol to existing wallets or new wallets
export const needNewWallets = true