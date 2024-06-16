// Importa o módulo mongoose, que é uma biblioteca de modelagem de dados para MongoDB.
const mongoose = require("mongoose");

// Define um novo esquema para armazenar detalhes do PDF. O esquema define a estrutura do documento dentro da coleção.
const PdfDetailsSchema = new mongoose.Schema({

    // Define um campo 'pdf' que armazenará uma string. Este campo é destinado a armazenar o caminho ou a URL do arquivo PDF.
    pdf: String,
    
    // Define um campo 'title' que armazenará uma string. Este campo é destinado a armazenar o título do PDF.
    title: String

// Configurações adicionais do esquema. Neste caso, define explicitamente o nome da coleção como "PdfDetails".
},{collection:"PdfDetails"})

// Cria um modelo chamado "PdfDetails" com base no esquema definido anteriormente. Este modelo permite interagir com a coleção "PdfDetails" no MongoDB.
mongoose.model("PdfDetails", PdfDetailsSchema);
