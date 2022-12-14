import { Router } from "express";
import { categoryList, newCategory } from "./controllers/categories.js";
import { gameList, newGame } from "./controllers/games.js";
import { customersList, theCustomer, newCustomer, updateCustomer } from "./controllers/customers.js";
import { rentalList , rentGame, returnGame, deleteRental } from "./controllers/rentals.js";

const routes = Router();
routes.get("/", (req,res)=>{res.send("HELLO DEV")});

routes.get("/categories", categoryList );
routes.post("/categories", newCategory);

routes.get("/games", gameList);
routes.post("/game", newGame);

routes.get("/customers", customersList);
routes.get("/customers/:id", theCustomer);
routes.post("/customers", newCustomer);
routes.put("/customers/:id", updateCustomer);

routes.get("/rentals", rentalList);
routes.post("/rentals", rentGame);
routes.post("/rentals/:id/return", returnGame);
routes.delete("/rentals/:id", deleteRental);

export default routes;