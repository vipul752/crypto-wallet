const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ethers = require("ethers");
const ecc = require("tiny-secp256k1");
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");
const bs58 = require("bs58").default;

const bip32 = BIP32Factory(ecc);

function deriveBitcoinWallet(seed) {
  const btcPath = "m/44'/0'/0'/0/0";

  const rootNode = bip32.fromSeed(seed);
  const btcNode = rootNode.derivePath(btcPath);

  const btcAddress = bitcoin.payments.p2pkh({
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

function deriveEthereumWallet(seed) {
  const ethPath = "m/44'/60'/0'/0/0";

  const rootNode = ethers.HDNodeWallet.fromSeed(seed);
  const ethNode = rootNode.derivePath(ethPath);

  console.log("derivation path ", ethPath);
  console.log("private key", ethNode.privateKey);
  console.log("public key", ethNode.publicKey);
  console.log("address", ethNode.address);
}

function deriveSolanaWallet(seed) {
  const solanaPath = "m/44'/501'/0'/0'";
  const solanaDerivedSeed = derivePath(solanaPath, seed).key;
  const solanaKeyPair = Keypair.fromSeed(solanaDerivedSeed);

  const solanaAddress = solanaKeyPair.publicKey.toBase58();
  const solanaPrivateKey = bs58.encode(solanaKeyPair.secretKey);

  console.log("Derivation Path", solanaPath);
  console.log("PrivateKey", solanaPrivateKey);
  console.log("public key/address", solanaAddress);
}

async function main() {
  const mnemonic = bip39.generateMnemonic();

  console.log(mnemonic);

  const seed = await bip39.mnemonicToSeed(mnemonic);

  deriveBitcoinWallet(seed);
  deriveEthereumWallet(seed);
  deriveSolanaWallet(seed);

  console.log("wallet generation successful");
}

main().catch((err) => {
  console.error(err);
});
