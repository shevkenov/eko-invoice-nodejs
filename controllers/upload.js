const formidable = require("formidable");
const fs = require("fs");
const iconv = require("iconv-lite");
const fileModel = require("../model/File");
const invoiceModel = require("../model/Invoice");

function parseInvoice(filePath,fileName) {
  const buffer = iconv.decode(fs.readFileSync(filePath), "cp866");
  const stringBuffer = buffer.toString();
  return stringBuffer
    .split("\r\n")
    .slice(1, -1)
    .map(inv => {
      const invData = inv.split(",");
      const station = invData[0].slice(0, 4);
      const invNo = invData[0].slice(0, 4) + "" + invData[0].slice(-6);
      const bulstat = invData[3].slice(1, invData[3].length - 2).trim();
      const name = invData[11].slice(1, invData[11].length - 2).trim();
      const vatno = invData[12].slice(1, invData[12].length - 2).trim();
      const date = invData[2]
        .split("-")
        .reverse()
        .join("-");
      return {
        number: invNo,
        station,
        date,
        bulstat,
        amount: invData[4],
        base: invData[5],
        vat: invData[8],
        name,
        vatno,
        klen: invData[16],
        fileName
      };
    });
}

function processFile(file) {
  return new Promise(resolve => {
    const fileName = file.name.slice(0, 8);
    resolve(fileModel.create({ fileName }));
  });
}

function processInvoiceData(file) {
  const fileName = file.name.slice(0, 8);
  const invoiceData = parseInvoice(file.path,fileName);
  return new Promise((resolve) => {
    resolve(
      invoiceModel.insertMany(invoiceData)
    );
  });
}

function removeFile(file) {
  return new Promise(resolve => {
    resolve(fs.unlink(file.path, () => console.log(`${file.name} removed!`)));
  });
}

module.exports = {
  getUpload: (req, res) => {
    res.render("upload.hbs");
  },
  postUpload: (req, res) => {
    const form = new formidable.IncomingForm();
    let recivedFiles = [];

    form.uploadDir = "upload";
    form.keepExtensions = true;
    form.multiples = true;
    //form.maxFileSize = 4 * 1024 * 1024;

    form.parse(req, (err, fields, files) => {

      if (!files.upload.length) {
        recivedFiles.push(files.upload);
        return;
      }

      recivedFiles = [...files.upload];
    });

    form.on("error", err => {
      res.render("upload.hbs", {
        error: `It is not allowed to upload more than 2 MB`
      });
    });

    form.on("end", () => {
      const promises = [];
      recivedFiles.forEach((file, inx) => {
        const regex = /^inv\d{5}\.csv$/i;
        if (regex.test(file.name)) {
          promises.push([
            processFile(file),
            processInvoiceData(file),
            removeFile(file)
          ]);
        }
      });

      Promise.all(
        promises.map(data => {
          return Promise.all(data);
        })
        )
        .then(result => {
          res.render("upload.hbs", {
            success: `${result.length} files imported!`
          });
          return;
        })
        .catch((err) => {
          fs.appendFile(__basedir + '/logs/invoices.log', `${new Date(Date.now()).toLocaleString()}: ${err}\r\n`, (error) => {
            console.log(err)
          })

          res.render("upload.hbs", {
            error: `Something went wrong!`
          });
          return
        });
    });
  }
};
