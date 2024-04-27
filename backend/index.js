import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import router from "./routes/ProductRoute.js";

const app = express();
/*CORS adalah mekanisme yang memungkinkan server memberikan izin kepada klien untuk 
mengakses sumber daya dari domain yang berbeda.*/
app.use(cors());
app.use(express.json()); //untuk parsing dari http sehingga dapat menerima pemintaan berbentuk json
app.use(FileUpload()); //middlewar express untuk mengupload file
app.use(express.static("public")); //static (isi foldernya)
app.use(router);

app.listen(5000, () => console.log("Server Up and Running... on 5000"));
