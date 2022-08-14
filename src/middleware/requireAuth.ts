import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = "MY_ASS_HURTS";

const requireAuth = (req, res, next) => {
    const {
        authorization
    } = req.headers;
    // authorization === "Bearer <JWT>"

    if (!authorization) {
        return res.status(401).send({
            error: "You must be logged in!"
        });
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({
                error: "You must be logged in!"
            });
        }

        const {
            userId
        } = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
};

export default requireAuth;