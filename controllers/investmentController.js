import * as investmentService from '../services/investmentService.js';

export const getInvestments = async (req, res) => {
    try {
        const investments = await investmentService.getInvestmentsByUserId(req.user.id);
        res.status(200).json(investments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInvestment = async (req, res) => {
    try {
        // Mapeo de los datos del frontend a los campos del modelo de la base de datos
        const {
            descripcion,
            investment_type_id,
            beneficiario,
            montoInvertido,
            interes,
            fechaInversion,
            fechaVencimiento,
            cuentaId,
            estado
        } = req.body;

        const investmentData = {
            investment_name: descripcion, // Mapeo
            description: descripcion,     // Mapeo
            investment_type_id: investment_type_id,
            beneficiary: beneficiario,    // Mapeo
            invested_amount: montoInvertido, // Mapeo
            interest: interes,            // Mapeo
            investment_date: fechaInversion, // Mapeo
            due_date: fechaVencimiento,   // Mapeo
            account_id: cuentaId,         // Mapeo
            status: estado
        };

        const newInvestment = await investmentService.createInvestmentForUser(req.user.id, investmentData);
        res.status(201).json(newInvestment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getInvestmentTypes = async (req, res) => {
    try {
        const investmentTypes = await investmentService.getInvestmentTypes();
        res.status(200).json(investmentTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching investment types', error: error.message });
    }
};
export const getInvestmentById = async (req, res) => {
    try {
        const investment = await investmentService.getInvestmentById(req.user.id, req.params.id);
        res.status(200).json(investment);
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 500).json({ message: error.message });
    }
};
export const updateInvestment = async (req, res) => {
    try {
        const updatedInvestment = await investmentService.updateInvestmentForUser(req.user.id, req.params.id, req.body);
        res.status(200).json(updatedInvestment);
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message });
    }
};
export const deleteInvestment = async (req, res) => {
    try {
        await investmentService.deleteInvestmentForUser(req.user.id, req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(error.message.includes('not found') ? 404 : 500).json({ message: error.message });
    }
};