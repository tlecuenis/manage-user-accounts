const DTO_PROPERTY_NAMES = ['email', 'password'];

// const loginDTOSchema = {
//     type: 'object',
//     properties: {
//         email: { type: 'string', format: 'email' },
//         password: { type: 'string' }
//     },
//     required: ['email', 'password'],
//     additionalProperties: false
// };

const validateLoginDTO = (req, res, next) => {
    const loginDto = req.body;
    if(typeof(loginDto) !== 'object') res.status(400).send("body debe ser formato JSON");

    const bodyPropertyNames = Object.keys(loginDto)

    const checkProperties = bodyPropertyNames.length === DTO_PROPERTY_NAMES.length && bodyPropertyNames.every(bodyPropertyNames => 
        DTO_PROPERTY_NAMES.includes(bodyPropertyNames)
        //faltaría agregar que el email sea estrictamente formato email
    );
    if(!checkProperties) res.status(400).send("body debe contener unicamente email y password");
    
    next();
};
export default validateLoginDTO;