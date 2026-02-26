import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.AES_SECRET, "utf-8");
const ivLength = 16;

//ecrypt function
export const encryptText = (text)=> {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
};

//decrypt function
export const decryptText  = (encryptedText) => {
    const parts = encryptedText.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};