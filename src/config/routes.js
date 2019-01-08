const express = require('express');
const auth = require('./auth');

module.exports = function (server) {
    /**
     * Rotas protegidas por Token
     */
    const protectedApi = express.Router();
    server.use('/api', protectedApi);

    protectedApi.use(auth);

    //Rotas do Ciclo de Pagamento
    const BillingCycle = require('../api/billingCycle/billingCycleService.js');
    BillingCycle.register(protectedApi, '/billingCycles');

    /**
     * Rotas abertas
     */
    const openApi = express.Router()
    server.use('/oapi', openApi);

    const AuthService = require('../api/user/AuthService');
    openApi.post('/login', AuthService.login);
    openApi.post('/signup', AuthService.singup);
    openApi.post('/validateToken', AuthService.validateToken);
} 