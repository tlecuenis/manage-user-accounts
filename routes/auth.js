import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";

const authRouter = Router();

//Endpoint público (no es necesario autenticarse ni autorizarse)
authRouter.get("/publico", (req, res) =>{
    res.send("Endpoint público");
});

//Endpoint autenticado para todo usuario registrado
authRouter.post("/autenticado", (req, res) =>{
    const { email, password } = req.body;

    if(!email || !password) return res.sendStatus(400);

    const user = USERS_BBDD.find(user => user.email === email);
    if(!user) return res.sendStatus(401);
    if(user.password !== password) return res.sendStatus(401);

    res.send(`Usuario ${user.name} autenticado`);
});

//Endpoint autorizado a administradores
authRouter.post("/autorizado", (req, res) =>{
    const { email, password } = req.body;

    if(!email || !password) return res.sendStatus(400);

    const user = USERS_BBDD.find(user => user.email === email);
    if(!user) return res.sendStatus(401);

    if(user.password !== password) return res.sendStatus(401);

    if(user.role !== "admin") return res.sendStatus(403);

    res.send(`Usuario administrador ${user.name}`);
});

export default authRouter;