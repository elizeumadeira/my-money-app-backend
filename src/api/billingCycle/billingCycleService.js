const BillingCycle = require('./billingCycle.js');
const errorHandler = require('../common/errorHandler.js');

BillingCycle.methods(['get', 'post', 'put', 'delete']);
BillingCycle.updateOptions({
    new: true,
    runValidators: true
});
//sintaxe alternativa (concatenado)
// BillingCycle.after('post', errorHandler).after('put', errorHandler);
BillingCycle.after('post', errorHandler);
BillingCycle.after('put', errorHandler);

BillingCycle.route('count', (req, res, next) => {
    BillingCycle.count((error, value) => {
        if (error) {
            res.status(500).json({
                erros: [error]
            });
        } else {
            res.json({
                value
            });
        }
    });
});

// BillingCycle.route('summary', (req, res, next) => {
//     BillingCycle.aggregate({
//         $project: {credit: {$sum: "$credits.value"}, debt: {$sum: "$debts.value"}}
//     }, {
//         $group: {_id: null,credit: {$sum: "$credit"}, debt: {$sum: "$debt"}}
//     }, {
//         $project: {_id: 0,credit: 1,debt: 1}
//     }, (error, result) => {
//         if (error) {
//             res.status(500).json({
//                 errors: [error]
//             });
//         } else {
//             res.json(result[0] || {
//                 credit: 0,
//                 debt: 0
//             })
//         }
//     });
// });


BillingCycle.route('summary', (req, res) => {
    BillingCycle.find().exec(function (err, billingCollenction) {
        var summary = {
            credit: 0,
            debt: 0
        };
        billingCollenction.map(function (billing) {
            var credit = 0;
            var debt = 0;
            billing.credits.forEach(function (credito) {
                credit += credito.value;
            });

            billing.debts.forEach(function (debito) {
                debt += debito.value;
            });
            return {
                credit,
                debt
            }
        }).forEach(function (el) {
            summary.credit += el.credit;
            summary.debt += el.debt;
        });
        res.json(summary);
    });
});

module.exports = BillingCycle;