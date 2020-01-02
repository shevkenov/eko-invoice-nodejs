const invoiceModel = require('../model/Invoice');

module.exports = {
    getHome: (req,res) => {
        res.render('home.hbs');
    },
    postHome: (req,res) => {
        let {fromDate, toDate, bulstat, gasStation: station} = req.body;

        invoiceModel
          .find({
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
            bulstat: { $regex: "[0-9]*" + bulstat + "[0-9]*" },
            station: { $regex: "[0-9]*" + station + "[0-9]*" }
          })
          .then(invoices => {
            invoices = invoices.map(inv => {
              inv.stringDate = inv.date.toISOString().slice(0, 10);
              return inv;
            });
            res.render("home.hbs", {
              invoices,
              bulstat,
              station,
              fromDate,
              toDate
            });
          });

    }
}