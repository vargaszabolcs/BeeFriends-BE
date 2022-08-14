import { IUser } from "./../models/User";
import { Beehive, IBeehive } from "./../models/Beehive";
import express from "express";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

router.use(requireAuth);

interface IPostMiddlewareReqData {
    user: IUser
}

// Get all hives owned by the current user
router.get("/", async (req: express.Request & IPostMiddlewareReqData, res) => {
    try{
        const hives = await Beehive.find({ owner: req.user._id }).exec();
        res.send(hives);
    } catch (err) {
        console.error(err);
        res.send({error: "Something went wrong!"});
    }
});

// Add new hive
router.post("/", async (req: express.Request<unknown, unknown, IBeehive> & IPostMiddlewareReqData, res) => {
    console.log("Registering new hive:", req.body);

    try {
        const hive = new Beehive(req.body);
        hive.owner = req.user._id;
        await hive.save();
    } catch (err) {
        console.error(err);
        res.send({error: "Something went wrong!"});
    }

    res.send("Successful!");
});

// Delete a hive by id
router.delete("/:id", async (req, res) => {
    try {
        await Beehive.findByIdAndDelete(req.params.id).exec();
    } catch (err) {
        console.error(err);
        res.send({error: "Something went wrong!"});
    }
    
    res.send("Successful!");
});

// Get a single hive by id
router.get("/:id", async (req: express.Request & IPostMiddlewareReqData, res) => {
    try {
        const hive = await Beehive.findOne({ owner: req.user._id, _id: req.params.id }).exec();
        if (hive) {
            res.send(hive);
        } else {
            res.send({error: "Could not find hive!"});
        }
    } catch (err) {
        console.error(err);
        res.send({error: "Something went wrong!"});
    }
});

// Update existing hive
router.post("/:id", async (req: express.Request & IPostMiddlewareReqData, res) => {
    try {
        const hive = await Beehive.findOne({ owner: req.user._id, _id: req.params.id }).exec();
        if (hive) {
            Object.assign(hive, req.body);
            await hive.save();
        } else {
            res.send({error: "Could not find hive!"});
        }
    } catch (err) {
        console.error(err);
        res.send({error: "Something went wrong!"});
    }
    res.send("Successful!");
});

export default router;