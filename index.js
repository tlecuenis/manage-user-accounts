// crea una especie de servidor que puede escuchar request y responderlas
import expressServer from 'express';
import accountRouter from './routes/account.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const expressApp = expressServer();

expressApp.use(expressServer.json());
expressApp.use(expressServer.text());

expressApp.use("/account", accountRouter);


expressApp.listen(PORT, () => {
    console.log(`Servidor levantado del puerto ${PORT}`);
});



