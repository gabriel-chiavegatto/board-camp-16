import { connection } from "../database.js";
import joi from "joi";
async function gameList(req, res) {
    try {
        const { name } = req.query;
        let games;
        // if (name) {
        //     games = await connection.query(`
        //     SELECT 
        //         games.*,
        //         categories.name AS "categoryName"
        //     FROM games
        //     JOIN categories 
        //         ON games."categoryId" = categories.id
        //     WHERE games.name LIKE '%$1%';
        //     `, [name]); 

        //     console.log("HERE !!!!!!!!!!!!!!!!!")

        // } else {
        games = await connection.query(`
            SELECT 
                games.*,
                categories.name AS "categoryName" 
            FROM games 
            JOIN categories 
                ON games."categoryId" = categories.id;
            `);
        // }

        res.status(200).send(games)

    } catch (error) {
        console.log(error);
        res.status(422)
    }
}

async function newGame(req, res) {
    try {
        const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

        const schemaGame = joi.object({
            name: joi.string().required(),
            image: joi.string(),
            stockTotal: joi.number().greater(0).required(),
            categoryId: joi.number().required(),
            pricePerDay: joi.number().greater(0).required()
        });
        const validation = schemaGame.validate(req.body);
        if (validation.error) { return res.sendStatus(400) }

        const confirmCategory = await connection.query(`SELECT * FROM categories WHERE id = $1`, [categoryId]);
        if (confirmCategory.rows.length === 0) { return res.sendStatus(400) }

        const nameAvailability = await connection.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if (nameAvailability.rows.length !== 0) { return res.sendStatus(409) }

        await connection.query(`
        INSERT INTO games 
            (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1,$2,$3,$4,$5);
        `, [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.status(422);
    }
}

export { gameList, newGame }