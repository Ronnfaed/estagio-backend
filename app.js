// Importa o módulo express, que é um framework para construir aplicações web.
const express = require("express");

// Cria uma instância do express, que será a nossa aplicação.
const app = express();

// Importa o módulo mongoose, que é uma biblioteca de modelagem de dados para MongoDB.
const mongoose = require("mongoose");

// Configura a aplicação para usar o middleware express.json(), que permite manipular requisições JSON.
app.use(express.json());

// Importa o módulo cors, que permite configurar o CORS (Cross-Origin Resource Sharing) para a aplicação.
const cors = require("cors");

// Configura a aplicação para usar o CORS, permitindo que a aplicação receba requisições de diferentes origens.
app.use(cors());

// Configura um diretório estático chamado "files", para servir arquivos estáticos (como PDFs).
app.use("/files", express.static("files"));

// Conexão ao MongoDB
// Define a URL de conexão ao banco de dados MongoDB. Altere essa URL para sua chave de conexão se necessário.
const mongoUrl = "mongodb+srv://fergomessousa1300:g6Ma4EoUKLXF1vmL@estagio.bcdvzej.mongodb.net/?retryWrites=true&w=majority&appName=Estagio";

// Conecta ao MongoDB usando a URL fornecida, com a opção de usar um novo parser de URL.
mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
    })
    .then(() => {
        // Mensagem de sucesso ao conectar ao banco de dados.
        console.log("Conectado ao banco");
    })
    .catch((e) => console.log(e)); // Mensagem de erro se a conexão falhar.

// Multer
// Importa o módulo multer, que é usado para fazer upload de arquivos.
const multer = require('multer');

// Importa o módulo fs para manipulação de arquivos.
const fs = require('fs');

// Define a configuração de armazenamento para os arquivos enviados.
const storage = multer.diskStorage({
    // Define o diretório de destino para os arquivos enviados.
    destination: function (req, file, cb) {
        cb(null, './files')
    },

    // Define o nome do arquivo enviado, adicionando um sufixo único baseado no timestamp.
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-'
        cb(null, uniqueSuffix + file.originalname)
    }

})

// Importa o esquema PdfDetails.
require("./pdfDetails");

// Cria um modelo do mongoose baseado no esquema PdfDetails.
const PdfSchema = mongoose.model("PdfDetails");

// Cria uma instância do multer com a configuração de armazenamento definida.
const upload = multer({ storage: storage })

// Define uma rota POST para upload de arquivos.
app.post("/upload-files", upload.single("file"), async (req, res) => {
    // Loga as informações do arquivo enviado no console.
    console.log(req.file);
    const title = req.body.title;
    const fileName = req.file.filename;

    try {
        // Cria um novo documento no MongoDB com o título e o nome do arquivo.
        await PdfSchema.create({ title: title, pdf: fileName });
        res.send("Ok.");
    } catch (error) {
        // Retorna um JSON com o erro, caso ocorra algum problema.
        res.json({
            status: error
        })
    }
});

// Define uma rota GET para obter os arquivos do banco de dados.
app.get("/get-files", async (req, res) => {
    try {
        // Busca todos os documentos na coleção PdfDetails.
        PdfSchema.find({}).then(data => {
            // Envia os dados encontrados em um objeto JSON.
            res.send({ status: "ok", data: data });
        });
    } catch (error) {
        // Trata qualquer erro que possa ocorrer (bloqueio vazio neste caso).
    }
});


// Define uma rota DELETE para deletar um arquivo.
app.delete("/delete-file/:pdf", async (req, res) => {
    const pdf = req.params.pdf;

    console.log(`Tentando deletar o arquivo: ${pdf}`); // Adicione este log

    try {
        // Remove o documento correspondente do banco de dados.
        const result = await PdfSchema.findOneAndDelete({ pdf: pdf });

        // Se o documento foi encontrado e removido, remove o arquivo físico.
        if (result) {
            fs.unlink(`./files/${pdf}`, (err) => {
                if (err) {
                    console.error("Erro ao deletar o arquivo: ", err);
                    res.json({ status: "error", message: "Erro ao deletar o arquivo." });
                } else {
                    res.json({ status: "ok", message: "PDF deletado com sucesso." });
                }
            });
        } else {
            res.json({ status: "error", message: "PDF não encontrado." });
        }
    } catch (error) {
        res.json({ status: "error", message: "Erro ao deletar o PDF." });
    }
});


// Define uma rota GET para a raiz da aplicação.
app.get("/", async (req, res) => {
    // Responde com uma mensagem de sucesso.
    res.send("Sucesso!");
});

// Inicia o servidor na porta 5000 e loga uma mensagem ao iniciar.
app.listen(5000, () => {
    console.log("Server iniciado");
});
