import express, { Request, Response, NextFunction } from "express"; // Import Express package
import dotenv from "dotenv"; // Import dotenv package
dotenv.config(); // Read .env file
import cors from "cors";
import employeeRouter from "./routes/employees.routes";

// create server
const app = express();

//Middleware
app.use(cors());

app.use(express.json());

//Routes
app.use("/employees", employeeRouter);

// Fallback
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Invalid route");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
