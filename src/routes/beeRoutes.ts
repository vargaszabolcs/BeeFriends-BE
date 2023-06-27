import express from "express";
import requireAuth from "../middleware/requireAuth";
import { Record } from "../models/Record";
import { Beehive, IBeehive } from "./../models/Beehive";
import { IUser } from "./../models/User";

const router = express.Router();

router.use(requireAuth);

interface IPostMiddlewareReqData {
    user: IUser;
}

// Get all hives owned by the current user
router.get("/", async (req: express.Request & IPostMiddlewareReqData, res) => {
    try {
        const hives = await Beehive.find({ owner: req.user._id }).exec();
        res.send(hives);
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
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
        res.send({ error: "Something went wrong!" });
    }

    res.send("Successful!");
});

// Delete a hive by id
router.delete("/:id", async (req, res) => {
    try {
        await Beehive.findByIdAndDelete(req.params.id).exec();
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
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
            res.send({ error: "Could not find hive!" });
        }
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
    }
});

// Update existing hive
router.post("/:id", async (req: express.Request & IPostMiddlewareReqData, res) => {
    console.log("Updating hive:", req.body);

    try {
        const hive = await Beehive.findOneAndUpdate({ owner: req.user._id, _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        }).exec();

        if (hive) {
            res.send(hive);
        } else {
            res.send({ error: "Could not find hive!" });
        }
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
    }
});

// Create new record for a hive
router.post("/:id/records", async (req: express.Request & IPostMiddlewareReqData, res) => {
    console.log("Creating new record:", req.body);

    try {
        const hive = await Beehive.findOne({ owner: req.user._id, _id: req.params.id }).exec();

        if (hive) {
            const record = new Record(req.body);
            record.owner = req.user._id;
            record.beehive = hive._id;
            await record.save();
            res.send(record);
        } else {
            res.send({ error: "Could not find hive!" });
        }
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
    }
});

// Get all records for a hive
router.get("/:id/records", async (req: express.Request & IPostMiddlewareReqData, res) => {
    try {
        const hive = await Beehive.findOne({ owner: req.user._id, _id: req.params.id }).exec();

        if (hive) {
            const records = await Record.find({ owner: req.user._id, beehive: hive._id }).exec();
            res.send(records);
        } else {
            res.send({ error: "Could not find hive!" });
        }
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
    }
});

// Delete a record by id
router.delete("/:id/records/:recordId", async (req, res) => {
    try {
        await Record.findByIdAndDelete(req.params.recordId).exec();
    } catch (err) {
        console.error(err);
        res.send({ error: "Something went wrong!" });
    }

    res.send("Successful!");
});

export default router;
