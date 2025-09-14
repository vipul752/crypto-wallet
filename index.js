const bip39 = require("bip39");
const {BIP32Factory} = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ethers = require("ethers");
const ecc = require("tiny-secp256k1");
const {Keypair } = require("@solana/web3.js");
const {derivePath} = require('ed25519-hd-key')
const bs58 = require('bs58');


function deriveBitcoinWallet(seed) {
  const btcPath = "m/44'/0'/0'/0/0";

  const rootNode = bip32.fromSeed(seed);
  const btcNode = rootNode.derivePath(btcPath);
  const btcAddress = bitcoin.payment.p2pkh({
    pubkey: Buffer.from(btcNode.publicKey),
  }).address;

  const publickey = Array.from(btcNode.publicKey)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  console.log("derivation path ", btcPath);
  console.log("private key(WIF)", btcNode.toWIF());
  console.log("public key", publickey);
  console.log("address", btcAddress);
}

async function main() {
  const mnemonic = bip39.generateMnemonic();

  console.log(mnemonic);

  const seed = await bip39.mnemonicToSeed(mnemonic);

  deriveBitcoinWallet(seed);
  deriveEthereumWallet(seed);

  console.log("wallet generation successful");
}
