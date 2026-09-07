import "@hboictcloud/metadata";
import "./metadata.generated";
import "reflect-metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Express } from "express";

import { router } from "./routers/routes";
import contactRouter from "./routers/contact.routes";
import faqRouter from "./routers/faq.routes";
import createRideRouter from "./routers/Trip.routes";
import rolesRouter from "./routers/Role.routes";
import userRouter, { initializeUserORM } from "./routers/user.routes";
import authRouter, { initializeAuthORM } from "./routers/auth.routes";
import adminReportsRouter from "./routers/AdminReports.routes";
import vehiclerouter from "./routers/Vehicle.routes";
import reservationRouter from "./routers/Reservation.routes";
import departmentRouter from "./routers/Department.routes";
import favoriteTripRouter from "./routers/FavoriteTrip.route";

export const app: Express = express();

config({ quiet: true });
config({ path: ".env.local", override: true, quiet: true });

app.use(cors({
    credentials: true,
    origin(requestOrigin, callback) {
        callback(null, requestOrigin);
    },
}));

app.use(express.json());
app.use(cookieParser());

// public endpoints
app.use("/faq", faqRouter);

// routers
app.use("/api", createRideRouter);
app.use("/contact", contactRouter);
app.use("/roles", rolesRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/adminReports", adminReportsRouter);
app.use("/vehicles", vehiclerouter);
app.use("/reservations", reservationRouter);
app.use("/departments", departmentRouter);
app.use("/favorite-trip", favoriteTripRouter);
app.use("/", router);

const port: number = (process.env.PORT || 8080) as number;

Promise.all([initializeUserORM(), initializeAuthORM()])
    .then(() => {
        app.listen(port, () => {
            console.log(`API is running on http://localhost:${port}`);
        });
    })
    .catch((err: unknown) => {
        console.error("Failed to initialize ORM:", err);
    });
