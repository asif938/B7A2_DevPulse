import jwt from "jsonwebtoken";

import config from "../config";

const verifyToken = (token: string) => {

    return jwt.verify(
        token,
        config.secret as string
    );
};

export default verifyToken;