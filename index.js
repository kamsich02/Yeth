const { ethers } = require("ethers");
const BN = require("bn.js");
const dotenv = require("dotenv");
dotenv.config();

const privKey = process.env.PK; // Your private key
const fromAddress = process.env.FA; // Your wallet address
const toAddress = process.env.TA; // The recipient's wallet address

const provider = new ethers.JsonRpcProvider(process.env.RPC);
let wallet = new ethers.Wallet(privKey, provider);

async function sendMainTransaction() {
  try {
    let balance = await provider.getBalance(fromAddress);

      if (balance.toString() === "0") {
        console.log(
          "Insufficient balance in your account, waiting for balance..."
        );
        return false;
      }

      const dummytransaction = {
        to: toAddress,
        value: balance, // The amount to send
      };

      const gasLimit = await provider.estimateGas(dummytransaction);
      const GasPrice = (await provider.getFeeData()).maxFeePerGas;
      const Gasx = (await provider.getFeeData()).gasPrice;
      const transactionCost = gasLimit * GasPrice;
      const transactionx = gasLimit * Gasx;
      const amountToSend = balance - transactionCost;
      const amountx = balance - transactionx;

      let transactionCount = await provider.getTransactionCount(fromAddress);

      if (amountToSend > 0) {
        console.log("enough to send with normal Gas");
        transactionCount = await provider.getTransactionCount(fromAddress);
        const transactionnorm = {
          nonce: transactionCount,
          to: toAddress,
          value: amountToSend, // The amount to send
          gasPrice: GasPrice,
        };
        // Send the transaction
        const txn = await wallet.sendTransaction(transactionnorm);
        console.log(`Transaction hash: ${txn.hash}`);
        return txn;
      } else if (amountx > 0) {
          console.log("enough to send with low Gas");
          transactionCount = await provider.getTransactionCount(fromAddress);
          const transactionlow = {
            nonce: transactionCount,
            to: toAddress,
            value: amountx, // The amount to send
            gasPrice: Gasx,
          };
          // Send the transaction
          const txl = await wallet.sendTransaction(transactionlow);
          console.log(`Transaction hash: ${txl.hash}`);
          return txl;
        } else {
          console.log("not enough to send with low or high Gas");
          return false;
        }
  } catch (error) {
    console.error("An error occurred while sending the main transaction:", error);
    return false;
  }
  
}


async function run() {
  while (true) {
    await sendMainTransaction();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

run();
