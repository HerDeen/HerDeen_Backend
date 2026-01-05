import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
function creatFolder() {
  const folderName = "./uploads";

  fs.mkdir(folderName, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
    } else {
      console.log("Folder created successfully!");
    }
  });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const ext = file.originalname.split(".")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname.split(".")[0] + "-" + `${uniqueSuffix}.${ext}`);
  },
});

export const upload = multer({ storage: storage });
