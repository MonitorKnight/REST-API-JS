import { Sequelize } from "sequelize";
//sequalize (namadb.username,pw,option)
const db = new Sequelize("updb", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
