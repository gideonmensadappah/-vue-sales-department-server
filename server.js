import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as mongo from "mongodb";
import { v4 as uuidv4 } from "uuid";

import { MongoConnection } from "./db/connection.js";

const app = express();
const port = 3000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
    return res.status(200).json({});
  }
  next();
});

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
let customersList;
app.get("/", async (req, res) => {
  try {
    const customers = await customersList
      .db("salesDepatment")
      .collection("customers")
      .find()
      .toArray();
    if (customers) {
      res.status(200).json(customers);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
app.post("/", async (req, res) => {
  const { fullName, city, phone } = req.body;
  try {
    const customer = await customersList
      .db("salesDepatment")
      .collection("customers")
      .insertOne({ _id: uuidv4(), fullName, phone, city });

    res.status(200).json(customer.ops[0]);
  } catch (err) {
    console.log(err);
  }
});

app.put("/", async (req, res) => {
  const { _id, fullName, phone, city } = req.body;

  try {
    const customer = await customersList
      .db("salesDepatment")
      .collection("customers")
      .findOneAndUpdate({ _id: _id }, { $set: { fullName, phone, city } });

    if (customer.ok) {
      res.status(200).json({ msg: "update", customer });
    } else {
      res.status(500).json({ msg: "please try to update again!" });
    }
  } catch (error) {
    console.log(error);
  }
});
app.delete("/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const response = await customersList
      .db("salesDepatment")
      .collection("customers")
      .deleteOne({ _id: customerId });

    if (response.result.ok) {
      res.status(200).json({ msg: "deleted user" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, async () => {
  console.log(`app on pr ${port}`);
  try {
    const uri =
      "mongodb+srv://departemtAdmin:123456Mensa@cluster0.zhd8y.mongodb.net/salesDepatment?retryWrites=true&w=majority";

    const mongo = new MongoConnection();
    customersList = await mongo.connect(uri);
    console.info("Welcome to Duper App Server DB is ON SET!");
  } catch (err) {
    console.error(err);
  }
});
