const {
    ValidationError
} = require("sequelize");
const {
    trimObjectStrings
} = require("../utilities");
const db = require("../models");
const Category = db.categories;

exports.findAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();

        return res.status(200).json({
            success: true,
            categories
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter as categorias. Tente novamente!"
        });
    }
}

exports.createCategory = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar categorias!",
        });
    }

    try {
        const category = await Category.findOne({
            where: {
                name: req.body.name
            }
        });

        if (category) {
            return res.status(406).json({
                success: false,
                msg: "Já existe uma categoria com esse nome!"
            });
        }

        const newCategory = await Category.create(trimObjectStrings(req.body));

        return res.status(201).json({
            success: true,
            sg: "Categoria criada!",
            uri: `/categories/${newCategory.id}`
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
            msg: err.message || "Ocorreu um erro ao criar a categoria. Tente novamente!"
        });
    }
}

exports.updateCategory = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar categorias!",
        });
    }

    try {
        const category = await Category.findByPk(req.params.idCategory);

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Categoria não encontrada!"
            });
        }

        const categoryFind = await Category.findOne({
            where: {
                name: req.body.name
            }
        });

        if (categoryFind) {
            return res.status(406).json({
                success: false,
                msg: "Já existe uma categoria com esse nome!"
            });
        }

        await Category.update(trimObjectStrings({
            name: req.body.name
        }), {
            where: {
                id: req.params.idCategory
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Categoria atualizada!"
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
            msg: err.message || "Ocorreu um erro ao atualizar a categoria. Tente novamente!"
        });
    }
}

exports.deleteCategory = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar categorias!",
        });
    }

    try {
        const category = await Category.findByPk(req.params.idCategory);

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Categoria não encontrada!"
            });
        }

        await category.destroy({
            where: {
                id: req.params.idCategory
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Categoria apagada!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar a categoria. Tente novamente!"
        });
    }
}