import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";
//nanoid genera id's únicos
import { nanoid } from 'nanoid';

const sessions = []; //"BASE DE DATOS" DE SESSION_ID
const authSessionRouter = Router();

//Login con email y password
authSessionRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.sendStatus(400);

    //1. EL SERVIDOR VERIFICA QUE EL USUARIO Y CONTRASEÑA SEAN CORRECTOS
    const user = USERS_BBDD.find(user => user.email === email);
    if(!user) return res.sendStatus(401);
    if(user.password !== password) return res.sendStatus(401);
    const id = user._id
    
    //2. EL SERVIDOR LE ENVÍA AL CLIENTE UN SESSION_ID MEDIANTE LAS COOKIES
    //GUARDA ESE SESSION_ID EN LA "BASE DE DATOS"
    const sessionId = nanoid(); //devuelve un id único
    sessions.push({sessionId , id}); 
    res.cookie("sessionId", sessionId, {
        httpOnly: true //no permite que el cliente lea la cookie
    });

    res.send();
});

//Sesión autenticada con sesión para obtener el perfil del usuario
authSessionRouter.get("/profile", (req, res) => {
    const { cookies } = req;
    if(!cookies.sessionId) return res.sendStatus(401);
    
    //3. EL SERVIDOR RECIBE LA SESSION_ID DEL CLIENTE MEDIANTE LAS COOKIES
    //VERIFICA QUE CORRESPONDA CON LA QUE GUARDO EN LA "BASE DE DATOS"
    const userSession = sessions.find(session => session.sessionId === cookies.sessionId);
    if(!userSession) return res.sendStatus(401);

    const user = USERS_BBDD.find(user => user._id === userSession.id);
    if(!user) return res.sendStatus(401);

    delete user.password;

    //4. SI TODO COINCIDE EL SERVIDOR RESPONDE
    res.send(user);
});

export default authSessionRouter;