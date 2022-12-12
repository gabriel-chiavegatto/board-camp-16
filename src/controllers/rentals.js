import { connection } from "../database.js";
import joi from 'joi';
import dayjs from "dayjs";

async function rentalList(req, res) {
    try {
        const { customerId, gameId } = req.query;
        let rentals;

        if (customerId) {
            rentals = (await connection.query(`
            SELECT * FROM rentals 
            WHERE "customerId" = $1
            `, [customerId])).rows;
        } if (gameId) {
            rentals = (await connection.query(`
            SELECT * FROM rentals 
            WHERE "gameId" = $1
            `, [gameId])).rows;
        } else {
            rentals = (await connection.query(`SELECT * FROM rentals`)).rows;
        }

        res.status(200).send(rentals);

    } catch (error) {
        res.sendStatus(422)
    }
}

async function rentGame(req, res) {
    try {
        const { customerId, gameId, daysRented } = req.body;

        const schemaDaysRented = joi.number().greater(0);
        const validation = schemaDaysRented.validate(daysRented);
        if (validation.error) { return res.sendStatus(400); }

        const customer = (await connection.query('SELECT * FROM customers WHERE id = $1', [customerId])).rows[0];
        const game = (await connection.query('SELECT * FROM games WHERE id = $1', [gameId])).rows[0];
        if (!customer || !game) { return res.sendStatus(400) }

        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = daysRented * game.pricePerDay;
        const returnDate = null;
        const delayFee = null;

        await connection.query(`
        INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ( $1,$2,$3,$4,$5,$6,$7 )
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(422)
    }
}

async function returnGame(req, res) {
    try {

    } catch (error) {
        res.sendStatus(422)
    }
}

async function deleteRental(req, res) {
    try {

    } catch (error) {
        res.sendStatus(422)
    }
}

export { rentalList, rentGame, returnGame, deleteRental }