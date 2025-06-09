const {body} = require("express-validator")

const userCreateValidation = () => {
    return[
        body("name")
            .isString()
            .withMessage("O nome é obrigatório")
            .isLength({min: 3})
            .withMessage("O nome precisa de no mínimo 3 caracteres"),
        body("email")
            .isString()
            .withMessage("Email é obrigatório")
            .isEmail()
            .withMessage("Insira um email valido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
            .isLength({min: 6})
            .withMessage("A senha precisa de no mínimo 6 caracteres"),
        body("confirmPassword")
            .isString()
            .withMessage("Confirmacao de senha é obrigatoria")
            .custom((value, {req})=>{
                if(value != req.body.password){
                    throw new Error("As senhas nao sao iguais")
                }
                return true
            }),

    ]
}

const loginValidation = ()=>{
    return[
        body("email")
            .isString()
            .withMessage("Email é obrigatório")
            .isEmail()
            .withMessage("Insira um email valido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
    ]
}

const userUpdateValidation = () => {


    return [
        body("name")
            .optional()
            .isLength({min: 3})
            .withMessage("O nome precisa de pelo menos 3 caracteres"),
        body("password")
            .optional()
            .isLength({min: 5})
            .withMessage("Sua senha precisa ter no minimo 5 caracteres"),
    ]

}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
}