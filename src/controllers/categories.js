import { connection } from "../database.js";
import joi from 'joi';


async function categoryList(req, res) {
    try {
        const categories = await connection.query('SELECT * FROM categories');
        res.status(200).send(categories.rows);
    }
    catch (error) {
        console.log(error)
        res.sendStatus(422)
    }
}

async function newCategory(req, res) {
    try {

        const { name } = req.body;

        const schemaName = joi.string().required();
        const validation = schemaName.validate(name);
        if (validation.error) { return res.sendStatus(400) }

        const availabilityName = await connection.query(`SELECT * FROM categories WHERE name = $1`,[name]);
        if(availabilityName.rows.length !== 0){
            return res.status(409).send("This name alredy being used")
        }

        await connection.query('INSERT INTO categories (name) VALUES ($1)',[name]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error)
        res.sendStatus(422)
    }
}

export { categoryList, newCategory }