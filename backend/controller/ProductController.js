import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";
import { where } from "sequelize";
import { request } from "http";
import { timeStamp } from "console";
//dapatkan product
export const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
//dapatkan product berdasarkan ID
export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
//simpan produk
export const saveProduct = (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "no file upload" });
  }
  const name = req.body.title;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + Date.now() + ext; //md5 semacam hash untuk mengacak nama,date now agar lebih mengacak bila ad afile sama yang diupload
  const url = `${req.protocol}://${req.get("host")}/img/${filename}`; //req.get("host") agar sesuai dengan hostingan
  const allowedType = [".png", ".jpg", ".jpeg"];

  //mengecek format/extension file
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "invalid image" });

  //mengecek ukuran file
  if (fileSize > 5000000 /*byte*/)
    return res.status(422).json({ msg: "Image must less than 5 MB" });

  //memindahkan file ke folder public
  file.mv(`./public/img/${filename}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      //membuat product baru
      await Product.create({ name: name, image: filename, url: url });
      return res.status(201).json({ msg: "Product Created successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateProduct = async (req, res) => {
  //menangkap product
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  //mengecek product ada atau tidak
  if (!product) return res.status(404).json({ msg: "Product Not Found" });
  let filename = "";
  //mengedit tanpa merubah
  if (req.files === null) {
    filename = Product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    filename = file.md5 + Date.now() + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "invalid image" });

    //mengecek ukuran file
    if (fileSize > 5000000 /*byte*/)
      return res.status(422).json({ msg: "Image must less than 5 MB" });

    //menghapus yang di folder juga menggunakan filepath
    //mendapatkan file yang ada di folder image dengan path nya juga
    const filePath = `./public/img/${product.image}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); //jika filepath ditemukan, hapus
    //memindahkan file ke folder public
    file.mv(`./public/img/${filename}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/img/${filename}`; //req.get("host") agar sesuai dengan hostingan
  try {
    await Product.update(
      { name: name, image: filename, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    return res.status(201).json({ msg: "Product Updated successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  //menangkap product
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  //mengecek product ada atau tidak
  if (!product) return res.status(404).json({ msg: "Product Not Found" });
  try {
    //menghapus yang di folder juga menggunakan filepath
    //mendapatkan file yang ada di folder image dengan path nya juga
    const filePath = `./public/img/${product.image}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); //jika filepath ditemukan, hapus
    //meghapus product yang ada didatabase
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};
