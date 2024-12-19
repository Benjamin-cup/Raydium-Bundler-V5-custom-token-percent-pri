import { ComputeBudgetProgram, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { newSendToken } from "../src/sendBulkToken";
import { Data, mainMenuWaiting, readBundlerWallets, readJson, saveBundlerWalletsToFile, saveHolderWalletsToFile, sleep } from "../src/utils";
import { connection } from "../config";
import { LP_wallet_private_key, bundlerWalletName, bundleWalletNum, needNewWallets, swapSolAmount } from "../settings"
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import bs58 from 'bs58'
import { screen_clear } from "../menu/menu";
import { execute } from "../src/legacy";

const walletNum = bundleWalletNum
export const wallet_create = async () => {
  screen_clear()
  console.log(`Creating ${walletNum} Wallets for bundle buy`);

  let wallets: string[] = []

  if (needNewWallets) {
    // Step 1 - creating bundler wallets
    try {
      console.log(LP_wallet_private_key);
      wallets.push(LP_wallet_private_key);
      for (let i = 0; i < (bundleWalletNum - 1); i++) {
        const newWallet = Keypair.generate()
        wallets.push(bs58.encode(newWallet.secretKey))
      }
      saveBundlerWalletsToFile(
        wallets, bundlerWalletName
      )

      await sleep(2000)
    } catch (error) { console.log(error) }
    console.log("🚀 ~ Bundler wallets: ", wallets)
  }

  const savedWallets = readBundlerWallets(bundlerWalletName)
  // console.log("🚀 ~ savedWallets: ", savedWallets)

  // Step 2 - distributing sol to bundler wallets
  console.log("Distributing sol to bundler wallets...")

  const walletKPs = savedWallets.map((wallet: string) => Keypair.fromSecretKey(bs58.decode(wallet)));
  const data = readJson()
  const LP_wallet_keypair = Keypair.fromSecretKey(bs58.decode(data.mainKp!))

  // 20 wallets sol airdrop transaction
  const batchNum = 4
  try {
    let walletIndex = 1;
    for (let i = 0; i < batchNum; i++) {
      const sendSolTx: TransactionInstruction[] = []
      sendSolTx.push(
        ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 250_000 })
      )
      for (let j = 0; j < ((bundleWalletNum - 1) / batchNum); j++) {
        let solAmount = swapSolAmount[walletIndex];
        sendSolTx.push(
          SystemProgram.transfer({
            fromPubkey: LP_wallet_keypair.publicKey,
            toPubkey: walletKPs[walletIndex].publicKey,
            lamports: (solAmount + 0.01) * LAMPORTS_PER_SOL
          })
        )
        walletIndex++;
      }
      let index = 0
      while (true) {
        try {
          if (index > 3) {
            console.log("Error in distribution")
            return null
          }
          const siTx = new Transaction().add(...sendSolTx)
          const latestBlockhash = await connection.getLatestBlockhash()
          siTx.feePayer = LP_wallet_keypair.publicKey
          siTx.recentBlockhash = latestBlockhash.blockhash
          const messageV0 = new TransactionMessage({
            payerKey: LP_wallet_keypair.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: sendSolTx,
          }).compileToV0Message()
          const transaction = new VersionedTransaction(messageV0)
          transaction.sign([LP_wallet_keypair])
          const txSig = await execute(transaction, latestBlockhash, 1)
          const tokenBuyTx = txSig ? `https://solscan.io/tx/${txSig}` : ''
          console.log("SOL distributed ", tokenBuyTx)
          break
        } catch (error) {
          index++
        }
      }
    }
    console.log("Successfully distributed sol to bundler wallets!")
  } catch (error) {
    console.log(`Failed to transfer SOL`)
  }

  mainMenuWaiting()
}
