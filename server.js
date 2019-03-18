import express from "express";
import bodyParser from "body-parser";
import auth from "./middlewares/auth";
import helloWorld from "./controllers/helloWorld";
import user from "./controllers/user";

const app = express();
const router = express.Router();

app.use(bodyParser.json());
/*
 * Add middleware. Because we defined the first parameter ( '/api' ), it will run
 * only for urls that starts with '/api/*'
 */
app.use("/api", auth);
/*
 * Add the protected route '/hello-world' after '/api'
 * So now it is available on /api/hello-world
 */
app.use("/api", helloWorld);
/*
 * Add the '/login' route handler
 */
app.use("/", user(router));

export default app;
