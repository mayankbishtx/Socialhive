import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const registrationSchema = z.object({
    name: z.string().min(2, "Name must be atleast 2 characters long"),
    username: z.string().min(3, "username must be atleast 3 characters").max(10, "Username too long").regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers, underscores"),
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
})

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const result = registrationSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({ message: result.error.issues[0].message });
        return;
    }
    next();
}

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const result = loginSchema.safeParse(req.body);
    if(!result.success) {
        res.status(400).json({ message: result.error.issues[0].message });
        return;
    }
    next();
}