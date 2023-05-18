import { Router } from "express";
import { USERS_BBDD } from '../bbdd.js';


const accountRouter = Router();

//Obtener detalles de una cuenta a partir del guID
accountRouter.get("/:_id", (req, res) => {
    const user = USERS_BBDD.find((user) => user._id === req.params._id);
    if(!user) return res.status(404).send("el id no concuerda con ningún usuario");
    
    res.send(user);
});

//Crear una nueva cuenta
//usaremos POST porque no se pueden crear dos cuentas iguales
accountRouter.post("/", (req, res) => {
    const { _id, name } = req.body;
    //si en la petición no están estos datos error 400
    if (!_id || !name) return res.status(400).send();

    const user = USERS_BBDD.find(user => user._id === _id);

    //si ya existe un usuario con ese id error 409
    if(user) return res.status(409).send();

    USERS_BBDD.push({
        _id,
        name
    });
    res.send();
});

//Actualizar el nombre de una cuenta
accountRouter.patch("/:_id", (req, res) => {
    const { name } = req.body;
    //si no enviamos nada en el body...
    if(!req.body) return res.status(400).send();
    
    const user = USERS_BBDD.find(user => user._id === req.params._id);
    
    //si no hay usuario con el mismo id
    if(!user) return res.status(404).send();
    
    //copiamos el nombre en el usuario
    user.name = name;
    
    console.log(req.params._id);
    res.send(user)
});

//Eliminar una cuenta
accountRouter.delete("/:_id", (req, res) => {
    const userIndex = USERS_BBDD.findIndex(user => user._id === req.params._id);
    
    //si el findIndex devuelve -1 fue porque no encontró coincidencias
    if(userIndex === -1) return res.status(404).send("el id no concuerda con ningún usuario");

    USERS_BBDD.splice(userIndex, 1);
    res.send(USERS_BBDD);
});

export default accountRouter;