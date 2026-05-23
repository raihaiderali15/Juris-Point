import dotenv from "dotenv";
import connectdb from "./config/db.js";
import app from "./app.js";

dotenv.config();

connectdb()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Database connection failed", err);
});