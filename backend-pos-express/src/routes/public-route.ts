import express from "express";
import customerControllers from "../resources/customer/customer-controller";
import employeeControllers from "../resources/employee/employee-controller";
import categoryControllers from "../resources/category/category-controller";
import menuControllers from "../resources/menu/menu-controller";

const publicRouter = express.Router();
publicRouter.get("/files", express.static("public", { index: false }));

publicRouter.post("/auth/customer/login", customerControllers.login);
publicRouter.post("/auth/customer", customerControllers.register);
publicRouter.post("/auth/employee/login", employeeControllers.login);

// publicRouter.get("/category", categoryControllers.getAll);
// publicRouter.get("/menu", menuControllers.getAllFromCustomer);
// publicRouter.get("/menu/:id", menuControllers.getById);
export default publicRouter;
