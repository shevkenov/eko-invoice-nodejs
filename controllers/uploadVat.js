const formidable = require('formidable');
const iconv = require("iconv-lite");
const fs = require('fs');

let fileData = {
  fileName: "",
  data: []
};

module.exports = {
    getVat: (req, res) => {
      res.render("vat.hbs");
    },
    postVat: (req, res) => {
      const form = new formidable.IncomingForm();
      form.uploadDir = "upload";
      form.keepExtensions = true;

      form.parse(req);
      form.on("file", (name, file) => {
        //const oldPath = file.path;
        //const newPath = form.uploadDir + "/" + file.name;
        fileData.fileName = file.name;

        //fs.renameSync(oldPath, newPath);

        const buffer = iconv.decode(fs.readFileSync(file.path), "win1251");
        const stringBuffer = buffer.toString();
        fileData.data = stringBuffer.split("\r\n").map(line => line.trim());

        fs.unlink(file.path, error => {
          if (error) throw error;
        });

        res.render("vat.hbs");
      });
    },

    getDownloadVat: (req, res) => {
      const file = __dirname + "/" + fileData.fileName;
      const stringData = iconv.encode(fileData.data.join("\r\n"), "win1251");

      fs.writeFileSync(file, stringData, error => {
        if (error) throw error;
      });

      res.download(file, error => {
        if (error) {
          throw error;
        }

        fs.unlink(file, err => {
          if (err) throw err;
        });
      });
    }
}