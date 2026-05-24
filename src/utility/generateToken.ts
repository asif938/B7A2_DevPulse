import jwt from "jsonwebtoken";
import config from "../config";

interface TJwtPayload {
    id: number;
    name: string;
    role: string;
}

const generateToken = (payload: TJwtPayload) => {

    return jwt.sign(
        payload,
        config.secret as string,
        {
            expiresIn: '1d',
        }
    );
};

export default generateToken;