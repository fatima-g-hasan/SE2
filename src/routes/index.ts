import { Router } from "express";
import OrderRoutes from "./order.route";
import UserRoutes from "./user.route";

const routes = Router();

routes.use('/orders', OrderRoutes)
routes.use('/users', UserRoutes)

export default routes;