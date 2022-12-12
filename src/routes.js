import { Router } from "express";

const routes = Router();

routes.get("/", (req,res)=>{res.send("HELLO DEV")});

export default routes;