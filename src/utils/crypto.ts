import { my_algorithm } from "../config/system.variable";
import mongoose from "mongoose";
import crypto from "node:crypto";
import { Task } from "../interface/daily.plan.interface";

export class Secure {
  static encrypt = async (
    data: string,
    password: string,
  ): Promise<{ iv: string; encrypted: string; authTag: string }> => {
    const { scrypt, randomFill, createCipheriv } = await import("node:crypto");
    const algorithm = process.env.ALGORITHM as crypto.CipherGCMTypes;

    return new Promise((resolve, reject) => {
      scrypt(password, "salt", 32, (err, key) => {
        if (err) {
          reject(err);
          return;
        }

        randomFill(new Uint8Array(16), (err, iv) => {
          if (err) {
            reject(err);
            return;
          }

          try {
            const cipher = createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update(data, "utf8", "hex");
            encrypted += cipher.final("hex");

            const authTag = cipher.getAuthTag(); // Get the authentication tag for GCM

            resolve({
              iv: Buffer.from(iv).toString("hex"),
              encrypted,
              authTag: authTag.toString("hex"), // Include the authentication tag in the response
            });
          } catch (error) {
            reject(error);
          }
        });
      });
    });
  };
  static decrypt = async (
    data: { iv: string; encrypted: string; authTag: string },
    password: string,
  ): Promise<string> => {
    const { scrypt, createDecipheriv } = await import("node:crypto");
    const algorithm = process.env.ALGORITHM as crypto.CipherGCMTypes;

    return new Promise((resolve, reject) => {
      scrypt(password, "salt", 32, (err, key) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const decipher = createDecipheriv(
            algorithm,
            key,
            Buffer.from(data.iv, "hex"),
          );

          decipher.setAuthTag(Buffer.from(data.authTag, "hex"));

          let decrypted = decipher.update(data.encrypted, "hex", "utf8");

          decrypted += decipher.final("utf8");

          resolve(decrypted);
        } catch (error) {
          reject(error);
        }
      });
    });
  };
}

export const assignIds = (tasks: Task[]) => {
  return tasks.map((task) => ({
    _id: new mongoose.Types.ObjectId(),
    ...task,
  }));
};
