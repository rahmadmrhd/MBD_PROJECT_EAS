import express from "express";
import { authEmployeeMiddleware } from "../middleware/auth-middleware";
import categoryControllers from "../resources/category/category-controller";
import tableControllers from "../resources/table/table-controller";
import employeeControllers from "../resources/employee/employee-controller";
import menuControllers from "../resources/menu/menu-controller";
import voucherControllers from "../resources/voucher/voucher-controller";
import { uploader, uploaders } from "../resources/file-uploader";
import orderControllers from "../resources/order/order-controller";
import reservationControllers from "../resources/reservation/reservation-controller";

export const employeeRouter = express.Router();
employeeRouter.use(authEmployeeMiddleware);

employeeRouter.post("/files", uploader.array("files"), uploaders);

employeeRouter.post("/auth/employee", employeeControllers.register);
employeeRouter.get("/auth/employee/current", employeeControllers.get);
employeeRouter.put("/auth/employee/current", employeeControllers.update);
employeeRouter.delete("/auth/employee/current", employeeControllers.logout);
employeeRouter.get("/auth/employee/verify", employeeControllers.verify);

employeeRouter.get("/category", categoryControllers.getAll);
employeeRouter.get("/category/:id", categoryControllers.getById);
employeeRouter.post("/category", categoryControllers.create);
employeeRouter.put("/category", categoryControllers.createAndUpdate);
employeeRouter.put("/category/:id", categoryControllers.update);

employeeRouter.get("/table", tableControllers.getAll);
employeeRouter.get("/table/:id", tableControllers.getById);
employeeRouter.post("/table", tableControllers.create);
employeeRouter.put("/table", tableControllers.createAndUpdate);
employeeRouter.put("/table/:id", tableControllers.update);

employeeRouter.get("/menu", menuControllers.getAll);
employeeRouter.get("/menu/:id", menuControllers.getById);
employeeRouter.get("/menu/:id/rating", menuControllers.getRateById);
employeeRouter.post("/menu", menuControllers.create);
employeeRouter.put("/menu/:id", menuControllers.update);
employeeRouter.delete("/menu/:id", menuControllers.remove);

employeeRouter.get("/voucher", voucherControllers.getAll);
employeeRouter.get("/voucher/:id", voucherControllers.getById);
employeeRouter.post("/voucher", voucherControllers.create);
employeeRouter.put("/voucher/:id", voucherControllers.update);
employeeRouter.delete("/voucher/:id", voucherControllers.remove);

employeeRouter.get("/order", orderControllers.getAll);
employeeRouter.get("/order/waiting", orderControllers.getAllWaitingList);
employeeRouter.get("/order/:id", orderControllers.getById);
employeeRouter.put("/order/:id", orderControllers.updateFromEmployee);

employeeRouter.get("/reservation", reservationControllers.getAll);
employeeRouter.post("/reservation", reservationControllers.createFromEmployee);
employeeRouter.get(
  "/reservation/waiting",
  reservationControllers.getAllWaitingList
);
employeeRouter.get("/reservation/:id", reservationControllers.getById);
employeeRouter.put(
  "/reservation/:id",
  reservationControllers.updateFromEmployee
);
