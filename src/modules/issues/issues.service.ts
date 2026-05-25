import { StatusCodes } from "http-status-codes";
import { pool } from "../../db";
import type { IIssue, IReporter, IUpdateIssue } from "./issues.interface";

const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
    const { title, description, type } = payload;

    const result = await pool.query(
        `INSERT INTO issues (
        title,
        description,
        type,
        reporter_id
        ) VALUES ($1, $2, $3, $4) 
        RETURNING * 
        `,
        [title, description, type, reporter_id]
    )
    return result.rows[0];
}

const getAllIssuesFromDB = async (
    query: Record<string, string>
) => {
    const sort = query.sort || "newest";
    const type = query.type;
    const status = query.status;

    let sqlQuery = `
        SELECT *
        FROM issues
    `;

    const conditions: string[] = [];
    const values: string[] = [];

    if (type) {
        values.push(type);
        conditions.push(
            `type = $${values.length}`
        );
    }

    if (status) {
        values.push(status);
        conditions.push(
            `status = $${values.length}`
        );
    }

    if (conditions.length > 0) {
        sqlQuery += `
            WHERE ${conditions.join(" AND ")}
        `;
    }

    sqlQuery += `
        ORDER BY created_at
    `;

    if (sort === "oldest") {
        sqlQuery += ` ASC`;
    } else {
        sqlQuery += ` DESC`;
    }

    const issuesResult = await pool.query(
        sqlQuery,
        values
    );

    if (issuesResult.rows.length === 0) {
        throw new Error("Issues not found");
    }

    const issues = issuesResult.rows;

    const reporterIds = [
        ...new Set(
            issues.map(
                issue => issue.reporter_id
            )
        )
    ];

    let reporters: IReporter[] = [];

    if (reporterIds.length > 0) {
        const reportersResult = await pool.query(
            `
            SELECT
                id,
                name,
                role
            FROM users
            WHERE id = ANY($1)
            `,
            [reporterIds]
        );

        reporters = reportersResult.rows;

    }

    const issuesWithReporters = issues.map(
        issue => {
            const reporter = reporters.find(
                user => user.id === issue.reporter_id
            );

            return {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                type: issue.type,
                status: issue.status,

                reporter: reporter || null,

                created_at: issue.created_at,
                updated_at: issue.updated_at,
            };

        }
    );

    return issuesWithReporters;
};

const getSingleIssuesFromDB = async (id: string) => {
    const result = await pool.query(`
        SELECT * FROM issues WHERE id=$1
        `,
        [id],
    );

    const issueData = result.rows[0];

    if (result.rows.length === 0) {
        throw new Error("Issues not found");
    }

    const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id=$1`,
        [issueData.reporter_id],
    )

    const reporter = reporterResult.rows[0];

    return {
        id: issueData.id,
        title: issueData.title,
        description: issueData.description,
        type: issueData.type,
        status: issueData.status,

        reporter,

        created_at: issueData.created_at,
        updated_at: issueData.updated_at,
    };
}

const updateIssueIntoDB = async (
    id: string,
    payload: IUpdateIssue,
    user: {
        id: number;
        role: string;
    }
) => {
    const issueResult = await pool.query(
        `
        SELECT *
        FROM issues
        WHERE id = $1
        `,
        [id]
    );

    if (issueResult.rows.length === 0) {
        throw new Error("Issue not found");
    }

    const issue = issueResult.rows[0];

    if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
            throw new Error(
                "You can only update your own issue"
            );

        }

        if (issue.status !== "open") {
            throw new Error(
                "You cannot update in progress or resolved issues"
            );
        }

        if (payload.status) {
            throw new Error(
                "Contributors cannot change status"
            );
        }
    }

    const result = await pool.query(
        `
        UPDATE issues
        SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            status = COALESCE($4, status),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
        `,
        [
            payload.title || null,
            payload.description || null,
            payload.type || null,
            user.role === "maintainer"
                ? payload.status || null
                : null,
            id,
        ]
    );
    return result.rows[0];
};

const deleteIssueFromDB = async (
    id: string
) => {
    const issueResult = await pool.query(
        `
        SELECT *
        FROM issues
        WHERE id = $1
        `,
        [id]
    );

    if (issueResult.rows.length === 0) {
        throw new Error(
            "Issue not found"
        );

    }

    await pool.query(
        `
        DELETE FROM issues
        WHERE id = $1
        `,
        [id]
    );

};

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssuesFromDB,
    updateIssueIntoDB,
    deleteIssueFromDB
}