import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";
import config from "../../config";

const signupUserIntoDB = async (payload: IUser) => {
    const {name, email, password, role} = payload;

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users(name,email,password,role) VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at`,
        [name, email, hashPassword, role || "contributor"]
    );
    return result.rows[0];
}

const logInUserIntoDB = async (payload: {
    email: string;
    password: string;
}) => {
    const {email, password} = payload;

    const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`,[email],
    );

    if(userData.rows.length === 0) {
        throw new Error("Invalid Credentials.");
    }

    const user = userData.rows[0];

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new Error("Invalid Credentials.")
    }

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            role: user.role,
        },
        config.secret as string,
        {
            expiresIn: '1d',
        }
    );

    const { password: userPassword, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword, };
};

export const authService = {
    signupUserIntoDB,
    logInUserIntoDB,
}