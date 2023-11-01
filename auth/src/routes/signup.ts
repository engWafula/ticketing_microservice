import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { RequestValidationError,validateRequest,BadRequestError } from '@waticket/common';
import { User } from "../models/user"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/api/users/signup", [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 to 20 characters")
], validateRequest, async(req: Request, res: Response) => {
    const errors = validationResult(req)
    const { email, password } = req.body

    const existingUser = await User.findOne({email:email})

    if(existingUser){
        throw new BadRequestError("Email in Use Already")

    }

    const user = User.build({
     email,
     password
    })

    await user.save()

    const userjwt = jwt.sign({
        email:user.email,
        id:user.id
    },process.env.JWT_KEY!)

    req.session= {jwt:userjwt}

    res.status(201).send(user)

})


export { router as signupRouter }