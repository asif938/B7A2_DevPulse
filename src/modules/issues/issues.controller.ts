import type { NextFunction, Request, Response } from "express";
import { issueService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reporter_id = req.user?.id;
        const result = await issueService.createIssueIntoDB(req.body, reporter_id as number);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const getAllIssues = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const result = await issueService.getAllIssuesFromDB(
                req.query as Record<string, string>
            );

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }

};

const getSingleIssue = async( req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    
    try {
        const result = await issueService.getSingleIssuesFromDB(id as string);
        // if(result.rows.length === 0){

        // }

        return sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export const issuesController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
}