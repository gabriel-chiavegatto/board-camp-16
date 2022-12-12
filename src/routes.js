import { Router } from "express";
import { categoryList, newCategory } from "./controllers/categories.js";
import { gameList, newGame } from "./controllers/games.js";

const routes = Router();

routes.get("/", (req,res)=>{res.send("HELLO DEV")});

routes.get("/categories", categoryList );
routes.post("/categories", newCategory);

routes.get("/games", gameList);
routes.post("/game", newGame);



export default routes;