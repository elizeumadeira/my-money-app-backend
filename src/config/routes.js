const express = require('express');

module.exports = function (server) {
    //Definit a URL base para todas as rotas
    const router = express.Router();
    server.use('/api', router);

    //Rotas do Ciclo de Pagamento
    const BillingCycle = require('../api/billingCycle/billingCycleService.js');
    BillingCycle.register(router, '/billingCycles');
}