// "Tabela" do banco de dados, para armazenar o PDF

const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema({

    pdf: String,
    title: String


},{collection:"PdfDetails"})


mongoose.model("PdfDetails", PdfDetailsSchema);