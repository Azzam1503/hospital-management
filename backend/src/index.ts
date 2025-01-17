import express, {Application, Request, Response} from "express";

const app: Application = express();


app.get("/", (req, res) => {
    res.send("Hello there");
});

app.listen(3000, () => {
    console.log("server is working fine");
}) 