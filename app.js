const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
app.use (express.json());
const cors = require ("cors");
app.use(cors());
app.use("/files", express.static("files"))




// Conexão ao MongoDB
// Alterar a MongoURL para a sua chave, caso continue usando MongoDB

const mongoUrl = "[MongoDB-Key]";

mongoose
    .connect(mongoUrl, {
    useNewUrlParser: true,
})

    .then(()=> {
    console.log("Conectado ao banco");
})

.catch((e) => console.log(e));

// Multer

const multer  = require('multer');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, './files')
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-'
      cb(null, uniqueSuffix+file.originalname)
    }

  })
  

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage })



app.post("/upload-files", upload.single("file") , async(req,res)=>{

    console.log(req.file);
    const title=req.body.title;
    const fileName=req.file.filename;

    try {
        await PdfSchema.create({title:title, pdf:fileName});
        res.send("Ok.");
    } 
    
    catch (error) {
        res.json({status:error

        })
    }

});

// Requisições HTTP

app.get("/get-files", async(req,res)=>{


    try {
    PdfSchema.find({}).then(data=>{

        res.send({status: "ok", data: data});
        
    });
    
    } 

    catch (error) {
    
    }

})

app.get("/", async (req,res) =>{

    res.send("Sucesso!");

});

app.listen(5000, () => {

    console.log("Server iniciado");

});