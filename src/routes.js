import { Router } from "express";
import { categoryList, newCategory } from "./controllers/categories.js";

const routes = Router();

routes.get("/", (req,res)=>{res.send("HELLO DEV")});

routes.get("/categories", categoryList );
routes.post("/categories", newCategory);


export default routes;