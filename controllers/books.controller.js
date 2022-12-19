const {
    Op,
    ValidationError
} = require("sequelize");
const {
    cleanEmptyObjectKeys,
    trimObjectStrings
} = require("../utilities");
const db = require("../models");
const Book = db.books;
const Category = db.categories;
const BookModule = db.book_modules;
const Activity = db.activity;
const ActivityType = db.activity_type;
const User = db.users;
const Notification = db.notifications;

// BOOKS
exports.findAllBooks = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver todos os livros!",
        });
    }

    try {
        const allBooks = await Book.findAll();

        let books = [];

        for (const book of allBooks) {
            const category = await Category.findByPk(book.dataValues.CategoryId);

            books.push({
                ...book.dataValues,
                category: category.name
            });
        }

        books = req.query.category ? books.filter(book => book.CategoryId === +req.query.category) : books;

        return res.status(200).json({
            success: true,
            books
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter os livros. Tente novamente!"
        });
    }
}

exports.createBook = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar livros!",
        });
    }

    try {
        const book = await Book.findOne({
            where: {
                [Op.or]: [{
                    name: req.body.name
                }, {
                    code: req.body.code
                }]
            }
        });

        if (book) {
            return res.status(406).json({
                success: false,
                msg: "Já existe um livro com esse nome ou código!"
            });
        }

        const newBook = await Book.create(trimObjectStrings(req.body));

        return res.status(201).json({
            success: true,
            msg: "Livro criado!",
            uri: `/books/${newBook.id}`
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
            msg: err.message || "Ocorreu um erro ao criar o livro. Tente novamente!"
        });
    }
}

exports.findOneBook = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver livros específicos!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const category = await Category.findByPk(book.dataValues.CategoryId);

        return res.status(200).json({
            success: true,
            book: {
                ...book.dataValues,
                category: category.name
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter o livro. Tente novamente!"
        });
    }
}

exports.updateBook = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar livros!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const data = cleanEmptyObjectKeys(trimObjectStrings(req.body));

        if (!Object.keys(data).length) {
            return res.status(400).json({
                success: false,
                msg: "Não tem informação para atualizar!"
            });
        }

        await Book.update(data, {
            where: {
                id: req.params.idBook
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Livro atualizado!"
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
            msg: err.message || "Ocorreu um erro ao atualizar o livro. Tente novamente!"
        });
    }
}

exports.deleteBook = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar livros!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        await Book.destroy({
            where: {
                id: req.params.idBook
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Livro apagado!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar o livro. Tente novamente!"
        });
    }
}

// BOOK MODULES
exports.findAllBookModules = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver todos os módulos!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const modules = await BookModule.findAll({
            where: {
                BookId: req.params.idBook
            }
        });

        return res.status(200).json({
            success: true,
            modules
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter os módulos. Tente novamente!"
        });
    }
}

exports.createBookModule = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar módulos!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook, {
            include: {
                model: BookModule
            }
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const newModule = await BookModule.create(trimObjectStrings({
            moduleName: req.body.moduleName,
            BookId: req.params.idBook
        }));

        return res.status(201).json({
            success: true,
            msg: "Módulo criado!",
            uri: `/books/${req.params.idBook}/modules/${newModule.id}`
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
            msg: err.message || "Ocorreu um erro ao criar o módulo. Tente novamente!"
        });
    }
}

exports.updateBookModule = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar módulos!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        await BookModule.update(trimObjectStrings({
            moduleName: req.body.moduleName
        }), {
            where: {
                id: req.params.idModule
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Módulo atualizado!"
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
            msg: err.message || "Ocorreu um erro ao atualizar o módulo. Tente novamente!"
        });
    }
}

exports.deleteBookModule = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar módulos!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        await BookModule.destroy({
            where: {
                id: req.params.idModule
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Módulo apagado!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar o módulo. Tente novamente!"
        });
    }
}

// BOOK MODULE ACTIVITIES
exports.findAllBookModuleActivities = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver todas as atividades!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        const moduleActivities = await Activity.findAll({
            where: {
                BookModuleId: req.params.idModule
            }
        });

        const activities = [];

        for (const activity of moduleActivities) {
            const type = await ActivityType.findByPk(activity.dataValues.ActivityTypeId);
            const activityObj = {
                ...activity.dataValues,
                question: activity.dataValues.question.split("/"),
                options: activity.dataValues.options.split("/").map(option => option.split(",")),
                correctAnswer: activity.dataValues.correctAnswer.split("/")
            };
            activities.push({
                ...activityObj,
                activityType: type.name
            })
        }

        return res.status(200).json({
            success: true,
            activities
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter as atividades. Tente novamente!"
        });
    }
}

exports.createBookModuleActivity = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar atividades!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        const newActivity = await Activity.create(trimObjectStrings({
            ...req.body,
            BookModuleId: req.params.idModule
        }));

        const users = await User.findAll({
            where: {
                typeUser: "regular"
            }
        });

        for (const user of users) {
            const books = await user.getBooks();
            const bookToNotify = books.find(book => book.dataValues.id === +req.params.idBook);
            if (bookToNotify) {
                const item = {
                    title: bookToNotify.name,
                    body: "Uma atividade foi adicionada ao livro.",
                    UserId: user.dataValues.id
                }
                await Notification.create(item);
            }
        }

        return res.status(201).json({
            success: true,
            msg: "Atividade criada!",
            uri: `/books/${req.params.idBook}/modules/${req.params.idModule}/activities/${newActivity.id}`
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
            msg: err.message || "Ocorreu um erro ao criar a atividade. Tente novamente!"
        });
    }
}

exports.findOneBookModuleActivity = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver atividades específicas!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        const activityObj = await Activity.findOne({
            where: {
                BookModuleId: req.params.idModule,
                id: req.params.idActivity
            }
        });

        if (!activityObj) {
            return res.status(404).json({
                success: false,
                msg: "Atividade não encontrada!"
            });
        }

        const activity = {
            ...activityObj.dataValues,
            question: activityObj.dataValues.question.split("/"),
            options: activityObj.dataValues.options.split("/").map(option => option.split(",")),
            correctAnswer: activityObj.dataValues.correctAnswer.split("/")
        };

        const type = await ActivityType.findByPk(activity.ActivityTypeId);

        return res.status(200).json({
            success: true,
            activity: {
                ...activity,
                activityType: type.name
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter a atividade. Tente novamente!"
        });
    }
}

exports.updateBookModuleActivity = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar atividades!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        const activity = await Activity.findOne({
            where: {
                BookModuleId: req.params.idModule,
                id: req.params.idActivity
            }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                msg: "Atividade não encontrada!"
            });
        }

        const data = cleanEmptyObjectKeys(trimObjectStrings(req.body));

        if (!Object.keys(data).length) {
            return res.status(400).json({
                success: false,
                msg: "Não tem informação para atualizar!"
            });
        }

        await Activity.update(data, {
            where: {
                id: req.params.idActivity
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Atividade atualizada!"
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
            msg: err.message || "Ocorreu um erro ao atualizar a atividade. Tente novamente!"
        });
    }
}

exports.deleteBookModuleActivity = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar atividades!",
        });
    }

    try {
        const book = await Book.findByPk(req.params.idBook);

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Livro não encontrado!"
            });
        }

        const module = await BookModule.findOne({
            where: {
                BookId: req.params.idBook,
                id: req.params.idModule
            }
        });

        if (!module) {
            return res.status(404).json({
                success: false,
                msg: "Módulo não encontrado!"
            });
        }

        const activity = await Activity.findOne({
            where: {
                BookModuleId: req.params.idModule,
                id: req.params.idActivity
            }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                msg: "Atividade não encontrada!"
            });
        }

        await Activity.destroy({
            where: {
                id: req.params.idActivity
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Atividade apagada!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar a atividade. Tente novamente!"
        });
    }
}