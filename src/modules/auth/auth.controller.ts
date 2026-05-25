import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.signupUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "User registered successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const logInUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.logInUserIntoDB(req.body);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Login Successful",
            data: result,
        })
    } catch (error) {
        next(error);
    }
}

export const authController = {
    signUpUser,
    logInUser,
}