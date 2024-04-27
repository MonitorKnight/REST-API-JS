import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product = db.define(
  "product",
  {
    //deklarasi tipe data yang ada di dalam tabel
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    //bisa juga seperti ini
    // // Model attributes are defined here
    // firstName: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // lastName: {
    //   type: DataTypes.STRING,
    //   // allowNull defaults to true
    // },
  },
  {
    // Opsi freezeTableName: true digunakan untuk mencegah Sequelize mengubah nama tabel menjadi bentuk jamak. Ini berarti nama tabel akan tetap "product" meskipun secara default Sequelize akan menambahkan huruf 's' di akhir nama tabel.
    freezeTableName: true,
  }
);

export default Product;

(async () => {
  await db.sync();
})();
