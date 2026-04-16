import express from "express";
import 'dotenv/config';
import cors from 'cors';
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import {setupSwagger} from "./swagger";
import serviceProviderRoute from "./routes/service-provider.route";
import customerRoute from "./routes/customer.route";
import cookieParser from "cookie-parser";
import {authenticate} from "./middlewares/authenticate";
import serviceRequestRoute from "./routes/service-request.route";
import serviceRequestStatusRoute from "./routes/service-request-status.route";
import unitRoute from "./routes/unit.route";
import vatRateRoute from "./routes/vat-rate.route";
import subscriptionRoute from "./routes/subscription.route";
import startScheduler from "./jobs/scheduler";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
app.use(express.json());

app.use(cookieParser());

setupSwagger(app);
startScheduler();

app.use('/api/auth', authRoute);
app.use('/api/customers', authenticate, customerRoute);
app.use('/api/serviceProviders', authenticate, serviceProviderRoute);
app.use('/api/serviceRequests', authenticate, serviceRequestRoute);
app.use('/api/serviceRequestStatuses', authenticate, serviceRequestStatusRoute);
app.use('/api/units', authenticate, unitRoute);
app.use('/api/subscriptions', authenticate, subscriptionRoute);
app.use('/api/users', authenticate, userRoute);
app.use('/api/vatRates', authenticate, vatRateRoute);

// Listen to port
app.listen(port, (error) => {
    console.log(`🚀 Express API is running on http://localhost:${port}`)
});