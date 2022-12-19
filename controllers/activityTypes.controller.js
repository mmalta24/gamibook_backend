const {
    ValidationError
} = require("sequelize");
const {
    trimObjectStrings
} = require("../utilities");
const db = require("../models");
const ActivityType = db.activity_type;

exports.findAllTypes = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver todos os tipos de atividade!",
        });
    }

    try {
        const activityTypes = await ActivityType.findAll();

        return res.status(200).json({
            success: true,
            activityTypes
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter os tipos de atividade. Tente novamente!"
        });
    }
}

exports.createType = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar tipos de atividade!",
        });
    }

    try {
        const activityType = await ActivityType.findOne({
            where: trimObjectStrings({
                name: req.body.name
            })
        });

        if (activityType) {
            return res.status(406).json({
                success: false,
                msg: "Já existe um tipo de atividade com esse nome!"
            });
        }

        const newType = await ActivityType.create(trimObjectStrings(req.body));

        return res.status(201).json({
            success: true,
            msg: "Tipo de atividade criada!",
            uri: `/activityTypes/${newType.id}`
        });
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            });
        }
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao criar o tipo de atividade. Tente novamente!"
        });
    }
}

exports.updateType = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar tipos de atividade!",
        });
    }

    try {
        const activityType = await ActivityType.findByPk(req.params.idType);

        if (!activityType) {
            return res.status(404).json({
                success: false,
                msg: "Tipo de atividade não encontrada!"
            });
        }

        await ActivityType.update(trimObjectStrings({
            name: req.body.name
        }), {
            where: {
                id: req.params.idType
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Tipo de atividade atualizada!"
        });
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            });
        }
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao atualizar o tipo de atividade. Tente novamente!"
        });
    }
}

exports.deleteType = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar tipos de atividade!",
        });
    }

    try {
        const activityType = await ActivityType.findByPk(req.params.idType);

        if (!activityType) {
            return res.status(404).json({
                success: false,
                msg: "Tipo de atividade não encontrada!"
            });
        }

        await ActivityType.destroy({
            where: {
                id: req.params.idType
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Tipo de atividade apagada!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar o tipo de atividade. Tente novamente!"
        });
    }
}