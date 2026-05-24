import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express"
import sendResponse from "../utility/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../type";

const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return sendResponse(res, {
                    statusCode: StatusCodes.UNAUTHORIZED,
                    success: false,
                    message: "Unauthorized access",
                });
            }

            const decoded = jwt.verify(
                token as string,
                config.secret as string
            ) as {
                id: number;
                name: string;
                role: "contributor" | "maintainer";
            };

            const userData = await pool.query(
                'SELECT id, name, email, role FROM users WHERE id=$1',[decoded.id],
            );

            const user = userData.rows[0];

            if(userData.rows.length === 0){
                return sendResponse(res, {
                    statusCode: StatusCodes.NOT_FOUND,
                    success: false,
                    message: "User Not Found",
                });
            }

            if(roles.length && !roles.includes(user.role)){
                return sendResponse(res, {
                    statusCode: StatusCodes.FORBIDDEN,
                    success: false,
                    message: "Forbidden access",
                });
            }

            req.user = decoded;

            next();
        } catch (error) {
            next(error);
        }
    }
}

export default auth;
