const {
    cleanEmptyObjectKeys,
    trimObjectStrings
} = require("../utilities");
const {
    Op,
    ValidationError
} = require("sequelize");
const db = require("../models");
const {
    activity
} = require("../models");
const User = db.users;
const Category = db.categories;
const UserBooks = db.user_books;
const Book = db.books;
const BookModule = db.book_modules;
const Activity = db.activity;
const ActivityType = db.activity_type;
const UserHistory = db.user_history;
const Level = db.levels;
const Achievement = db.achievements;

exports.findAllBooks = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver os livros que adicionou!",
        });
    }

    try {
        const user = await User.findByPk(req.userId);

        const allBooks = await user.getBooks();

        let books = [];

        for (const book of allBooks) {
            const cat = await Category.findByPk(book.CategoryId);

            const userBook = await UserBooks.findAll({
                where: {
                    BookId: book.id
                }
            });

            const likes = userBook.filter(book => book.liked);

            /*
            user_with_book - 100% (5 stars)
            user_liking_book - x
            rating = (likes * 5)/total
            */

            const obj = {
                id: book.id,
                name: book.name,
                imgBook: book.imgBook,
                imgBackground: book.imgBackground,
                authors: book.authors,
                CategoryId: book.CategoryId,
                category: cat.name,
                liked: book.User_Books.liked,
                rating: (likes.length * 5) / userBook.length
            }

            books.push(obj);
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
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para adicionar livros!",
        });
    }

    try {
        const book = await Book.findOne({
            where: {
                code: req.body.code
            }
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                msg: "Não existe um livro com esse código!"
            });
        }

        const user = await User.findByPk(req.userId);

        const books = await user.getBooks();

        if (books.find(b => b.id === book.id)) {
            return res.status(400).json({
                success: false,
                msg: "O livro já foi adicionado!"
            });
        }

        await user.addBook(book);

        return res.status(201).json({
            success: true,
            msg: "Livro adicionado!"
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
            msg: err.message || "Ocorreu um erro ao adicionar o livro. Tente novamente!"
        });
    }
}

exports.findOneBook = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver livros específicos!",
        });
    }

    try {
        const user = await User.findByPk(req.userId);

        const books = await user.getBooks();

        const bookItem = books.find(book => book.id === +req.params.idBook);

        if (!bookItem) {
            return res.status(404).json({
                success: false,
                msg: "Esse livro não está associado, portanto não é possível ver!"
            });
        }

        const modules = await BookModule.findAll({
            where: {
                BookId: req.params.idBook
            }
        });

        const activities = await Activity.findAll({
            where: {
                BookModuleId: {
                    [Op.in]: modules.map(module => module.id)
                }
            },
        });

        const history = await UserHistory.findAll({
            where: {
                UserId: req.userId,
                ActivityId: {
                    [Op.in]: activities.map(activity => activity.id)
                }
            }
        });

        /*
            number_exercises - 1
            completed_exercises - x
            completed_percentage = (completed_exercises * 1)/number_exercises
        */

        const book = {
            id: bookItem.id,
            name: bookItem.name,
            imgBook: bookItem.imgBook,
            imgBackground: bookItem.imgBackground,
            completedPercentage: (history.length * 1) / activities.length,
            modules: modules.map(module => {
                return {
                    ...module.dataValues,
                    activities: activities
                        .filter(activity => activity.BookModuleId === module.id)
                        .map(({
                            dataValues
                        }) => {
                            const a = dataValues;
                            return {
                                name: a.name,
                                completed: Boolean(history.find(h => h.ActivityId === a.id && h.answers === a.correctAnswer))
                            };
                        })
                }
            })
        };

        return res.status(200).json({
            success: true,
            book
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter o livro. Tente novamente!"
        });
    }
}

exports.updateBook = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar livros!",
        });
    }

    try {
        const user = await User.findByPk(req.userId);

        const books = await user.getBooks();

        if (!books.find(book => book.id === +req.params.idBook)) {
            return res.status(404).json({
                success: false,
                msg: "Esse livro não está associado, portanto não é possível atualizar!"
            });
        }

        const condition = {
            UserId: req.userId,
            BookId: +req.params.idBook
        };

        const userBook = await UserBooks.findOne({
            where: condition
        });

        await UserBooks.update({
            liked: !userBook.liked
        }, {
            where: condition
        });

        return res.status(200).json({
            success: true,
            msg: "Livro atualizado!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao atualizar o livro. Tente novamente!"
        });
    }
}

exports.deleteBook = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar livros!",
        });
    }

    try {
        const user = await User.findByPk(req.userId);

        const books = await user.getBooks();

        if (!books.find(book => book.id === +req.params.idBook)) {
            return res.status(404).json({
                success: false,
                msg: "Esse livro não está associado, portanto não é possível apagar!"
            });
        }

        const condition = {
            UserId: req.userId,
            BookId: +req.params.idBook
        };

        await UserBooks.destroy({
            where: condition
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

exports.findOneBookModuleActivity = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver atividades específicss!",
        });
    }

    try {
        const user = await User.findByPk(req.userId);

        const books = await user.getBooks();

        if (!books.find(book => book.id === +req.params.idBook)) {
            return res.status(404).json({
                success: false,
                msg: "Esse livro não está associado, portanto não é possível ver!"
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

        const history = await UserHistory.findOne({
            where: { UserId: req.userId, ActivityId: activity.id }
        });

        return res.status(200).json({
            success: true,
            activity: {
                ...activity,
                activityType: type.name,
                answers: history.answers
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
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar atividades!",
        });
    }

    try {
        const user = await User.findByPk(req.userId);

        const books = await user.getBooks();

        if (!books.find(book => book.id === +req.params.idBook)) {
            return res.status(404).json({
                success: false,
                msg: "Esse livro não está associado, portanto não é possível atualizar!"
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

        const condition = {
            UserId: req.userId,
            ActivityId: activity.id
        }

        const [history, created] = await UserHistory.findOrCreate({
            where: condition
        });

        if (history.answers === activity.correctAnswer) {
            return res.status(400).json({
                success: false,
                msg: "Não pode resolver um exercício que já está completo!"
            });
        }

        if (req.body.answers === activity.correctAnswer) {
            const currLevel = await user.getLevel();
            const nextLevel = await Level.findByPk(currLevel.dataValues.id + 1);
            const newTotalPoints = user.dataValues.totalPoints + activity.dataValues.points;
            await User.update({
                tickets: user.dataValues.tickets + 1,
                totalPoints: newTotalPoints,
                LevelId: nextLevel && newTotalPoints >= nextLevel.dataValues.points ?
                    nextLevel.dataValues.id : currLevel.dataValues.id
            }, {
                where: {
                    id: user.dataValues.id
                }
            });

            const allAchievements = await Achievement.findAll();
            let userAchieved = allAchievements.map(achievement => achievement.dataValues)
                .filter(ach => newTotalPoints >= ach.pointsNeeded);

            await user.addAchievements(userAchieved.map(achievement => achievement.id))
        }

        await UserHistory.update(trimObjectStrings({
            answers: req.body.answers
        }), {
            where: condition
        });

        return res.status(200).json({
            success: true,
            msg: "Atividade atualizada!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao atualizar a atividade. Tente novamente!"
        });
    }
}