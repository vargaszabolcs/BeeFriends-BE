import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { User } from "./../models/User";

const router = express.Router();

const JWT_SECRET = "MY_ASS_HURTS";

router.post("/signup", async (req, res) => {
    const { email, password, full_name } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.send({ error: "User already exists!" });
        }

        const user = new User({
            email,
            full_name,
            password,
        });

        await user.save();

        const token = jsonwebtoken.sign({ userId: user._id }, JWT_SECRET);
        res.send({ token, email, full_name, id: user._id });
    } catch (err) {
        console.error("Something went wrong with saving user to database!", err);
        return res.status(422).send(err.message);
    }
});

router.post("/login", async (req, res) => {
    console.log("Login request received");

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send({ error: "User does not exist!" });
    }

    try {
        await user.comparePasswords(password);
        const token = jsonwebtoken.sign({ userId: user._id }, JWT_SECRET);
        res.send({ token, email, full_name: user.full_name, id: user._id });
    } catch (err) {
        console.log("Password is not correct!");
        return res.send({ error: "Invalid password!" });
    }
});

router.post("/change-password", async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.send({ error: "User does not exist!" });
        }

        const isMatch = await user.comparePasswords(oldPassword);

        if (!isMatch) {
            return res.send({ error: "Old password does not match!" });
        }

        user.password = newPassword;
        await user.save();

        res.send({ message: "Password changed successfully!" });
    } catch (err) {
        console.error("Something went wrong with changing the password!", err);
        return res.status(422).send(err.message);
    }
});

router.delete("/delete-account", async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.send({ error: "User does not exist!" });
        }

        const isMatch = await user.comparePasswords(password);

        if (!isMatch) {
            return res.send({ error: "Password does not match!" });
        }

        await user.remove();

        res.send({ message: "Account deleted successfully!" });
    } catch (err) {
        console.error("Something went wrong with deleting the account!", err);
        return res.status(422).send(err.message);
    }
});

export default router;
