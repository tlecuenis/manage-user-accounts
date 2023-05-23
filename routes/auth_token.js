import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";
import { SignJWT, jwtVerify } from "jose";
import validateLoginDTO from "../dto/validate_login_dto.js";

const authTokenRouter = Router();

//Login con email y password
authTokenRouter.post("/login", validateLoginDTO, async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) return res.sendStatus(400);
    
    //1. EL SERVIDOR VERIFICA QUE EL USUARIO Y CONTRASEÑA SEAN CORRECTOS
    const user = USERS_BBDD.find(user => user.email === email);
    if(!user) return res.sendStatus(401);
    if(user.password !== password) return res.sendStatus(401);
    
    const id = user._id

    //2. EL SERVIDOR GENERA UN TOKEN Y LO ENVÍA AL CLIENTE
    const jwtConstructor = new SignJWT({ id });

    const encoder = new TextEncoder();
    //colocamos un await pq la función .sign devuelve una promise
    const jwt = await jwtConstructor
        .setProtectedHeader({alg: "HS256", typ: "JWT"})
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY));


    res.send({jwt});
});

//Solicitud autenticada con token para obtener el perfil del usuario
authTokenRouter.get("/profile", async (req, res) => {
    
    const { authorization } = req.headers;
    if(!authorization) return res.sendStatus(401);

    //3. EL SERVIDOR RECIBE EL TOKEN DE CABECERA
    //VERIFICA QUE EL PAYLOAD_ID(jwtData.payload.id) COINCIDA CON EL USER_ID
    try{
        const encoder = new TextEncoder();
        const {payload} = await jwtVerify(
            authorization,
            encoder.encode(process.env.JWT_PRIVATE_KEY)
        );
        const user = USERS_BBDD.find(user => user._id === payload.id);
        
        if(!user) return res.status(401).send("no user");

        delete user.password;
        
        //4. SI TODO COINCIDE EL SERVIDOR RESPONDE
        res.send(user);
    }catch{
        res.sendStatus(401);
    }

    
});

export default authTokenRouter;