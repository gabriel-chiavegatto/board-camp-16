import joi from "joi";
import { connection } from "../database.js";

async function customersList(req, res) {
    try {
        const customers = await connection.query(`SELECT * FROM customers`);
        res.status(200).send(customers.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(422)
    }
}

async function theCustomer(req, res) {
    try {
        const { id } = req.params;
        const customer = await connection.query(`
        SELECT * FROM customers
        WHERE id = $1;
        `, [id]);

        if (customer.rows.length === 0) {
            res.sendStatus(404)
        } else {
            res.status(200).send(customer.rows[0])
        }

    } catch (error) {
        res.sendStatus(422)
    }
}

async function newCustomer(req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;

        const schemaCustomer = joi.object({
            name: joi.string().required(),
            phone: joi.string().min(10).max(11),
            cpf: joi.string().min(11).max(11),
            birthday: joi.date().iso()
        })

        const validation = schemaCustomer.validate(req.body);
        if (validation.error) { return res.sendStatus(400) }

        if (isNaN(cpf) || isNaN(phone)) { return res.sendStatus(400); }

        const cpfAvailability = await connection.query(`
        SELECT * FROM customers 
        WHERE cpf = $1
        `, [cpf]);
        if (cpfAvailability.rows.length !== 0) { return res.sendStatus(409) }

        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1,$2,$3,$4);
        `, [name, phone, cpf, birthday]);

        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(422)
    }
}

async function updateCustomer(req, res) {
    try {
        const { id } = req.params;
        const { name, phone, cpf, birthday } = req.body;

        const schemaCustomer = joi.object({
            name: joi.string().required(),
            phone: joi.string().min(10).max(11),
            cpf: joi.string().min(11).max(11),
            birthday: joi.date().iso()
        });

        const validation = schemaCustomer.validate(req.body);
        if (validation.error) { return res.sendStatus(400) };

        if (isNaN(cpf) || isNaN(phone)) { return res.sendStatus(400); }

        const customer = (await connection.query('SELECT * FROM customers WHERE id = $1', [id])).rows[0];
        if (!customer) { res.sendStatus(404) }

        await connection.query('UPDATE customers SET name = $1 WHERE id = $2',[name, id]);
        await connection.query('UPDATE customers SET phone = $1 WHERE id = $2',[phone, id]);
        await connection.query('UPDATE customers SET cpf = $1 WHERE id = $2',[cpf, id]);
        await connection.query('UPDATE customers SET birthday = $1 WHERE id = $2',[birthday, id]);

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(422)
    }
}


export { customersList, theCustomer, newCustomer, updateCustomer }