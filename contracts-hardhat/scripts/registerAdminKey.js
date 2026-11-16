const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const addressInfo = require("../../frontend/src/contracts/address.json");

const { subtle } = globalThis.crypto;

function toPem(buffer, label) {
  const b64 = Buffer.from(buffer).toString("base64");
  const lines = b64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

async function main() {
  const { ethers } = hre;
  const [admin] = await ethers.getSigners();
  console.log("Admin address:", admin.address);

  const contract = await ethers.getContractAt(
    "HealthInsuranceNFT",
    addressInfo.HealthInsuranceNFT,
    admin
  );

  const existingKey = await contract.encryptionKeyOf(admin.address);
  if (existingKey && existingKey.length > 0) {
    console.log("Admin already has encryption key registered on-chain!");
    console.log("Key length:", existingKey.length);
    return;
  }

  console.log("Generating RSA-OAEP 2048 keypair...");
  const kp = await subtle.generateKey(
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ["encrypt", "decrypt"]
  );

  const spki = await subtle.exportKey("spki", kp.publicKey);
  const pkcs8 = await subtle.exportKey("pkcs8", kp.privateKey);

  const publicKeyPem = toPem(spki, "PUBLIC KEY");
  const privateKeyPem = toPem(pkcs8, "PRIVATE KEY");

  // Save keypair locally so Member B can import if needed
  const keyFile = path.join(__dirname, "insurer_keypair.json");
  fs.writeFileSync(
    keyFile,
    JSON.stringify(
      {
        address: admin.address,
        publicKeyPem,
        privateKeyPem,
        createdAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
  console.log("Keypair saved locally to:", keyFile);

  console.log("Calling contract.registerEncryptionKey on Sepolia...");
  const tx = await contract.registerEncryptionKey(publicKeyPem);
  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber);

  const verifiedKey = await contract.encryptionKeyOf(admin.address);
  console.log("Verified key on-chain! Length:", verifiedKey.length);
  console.log("Success! Patient can now encrypt healthId and purchase policies.");
}

main().catch((err) => {
  console.error("Error registering admin key:", err);
  process.exit(1);
});
