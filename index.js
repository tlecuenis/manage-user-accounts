// crea una especie de servidor que puede escuchar request y responderlas
import expressServer from 'express';
import cookieParser from 'cookie-parser';
import accountRouter from './routes/account.js';
import authRouter from './routes/auth.js';
import authSessionRouter from './routes/auth_session.js'
import authTokenRouter from './routes/auth_token.js'
import dotenv from 'dotenv'; //esta librería carga las variables del .env en process.env

dotenv.config();

const PORT = process.env.PORT || 3000;
const expressApp = expressServer();

expressApp.use(cookieParser());
expressApp.use(expressServer.json());
expressApp.use(expressServer.text());

expressApp.use("/account", accountRouter);
expressApp.use("/auth", authRouter);
expressApp.use("/auth-token", authTokenRouter);
expressApp.use("/auth-session", authSessionRouter);


expressApp.listen(PORT, () => {
    console.log(`Servidor levantado del puerto ${PORT}`);
});



