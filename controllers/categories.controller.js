const db = require("../models");
const Category = db.categories;

exports.create = async (req, res) => {
    try {
        let category = await Category.findOne({
            where: {
                name: req.body.name
            }
        }); //get category data from DB
        if (category) return res.status(400).json({
            success: false,
            msg: "Category already exists."
        });
        // Save category to DB
        await Category.create({
            id: req.body.id,
            name: req.body.name,
        });
        return res.status(201).json({
            success: true,
            msg: "Category was created successfully!",
            uri: `categories/${req.body.name}`
        });
    } catch (err) {
        if (err instanceof ValidationError)
        res.status(400).json({
            success: false,
            msg: err.errors.map(e => e.message)
        });
    else
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while creating the category."
        });
    };
}


exports.findAll = async (req, res) => {
    try {
        let categories = await Category.findAll();

        res.status(200).json({
            success: true,
            categories: categories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while retrieving the categories."
        })
    }
}

exports.update = async (req, res) => {
    try {
        let category = await Category.findOne({
            where: {
                id: req.params.id
            }
        });
        if (category === null)
            return res.status(404).json({
                success: false,
                msg: `Cannot find any category with id ${req.params.id}.`
            });
    
    
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                error: "Only update name!",
            });
        }

        const newCategory = {
            name: req.body.name,
        };

        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Category.update(newCategory, { where: { id: req.params.id } })
        
        if (affectedRows[0] === 0) // check if the user was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on category ${req.params.id}.`
            });

        res.json({
            success: true,
            msg: `Category ${req.params.id} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving category ${req.params.id}.`
        });
    };
};


exports.delete = async (req, res) => {
    try {
        let category = await Category.findOne({where: {id: req.params.id}});
        if (category === null)
            return res.status(404).json({
                success: false,
                msg: `Cannot find any category with id ${req.params.id}.`
            });

        let result = await Category.destroy({
            where: {
                id: req.params.id
            }
        })
        // console.log(result)

        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true,
                msg: `The category with id ${req.params.id} was successfully deleted!`
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: `Error deleting category with id ${req.params.id}.`
        });
    };
};