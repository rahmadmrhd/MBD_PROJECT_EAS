import express from "express";
import { authCustomerMiddleware } from "../middleware/auth-middleware";
import categoryControllers from "../resources/category/category-controller";
import customerControllers from "../resources/customer/customer-controller";
import menuControllers from "../resources/menu/menu-controller";
import { uploader, uploaders } from "../resources/file-uploader";
import orderControllers from "../resources/order/order-controller";
import voucherControllers from "../resources/voucher/voucher-controller";
import reservationControllers from "../resources/reservation/reservation-controller";
import cartControllers from "../resources/cart/cart-controller";
import tableControllers from "../resources/table/table-controller";

export const customerRouter = express.Router();
customerRouter.use(authCustomerMiddleware);

customerRouter.post("/files", uploader.array("files"), uploaders);

customerRouter.get("/auth/customer/verify", customerControllers.verifyToken);
customerRouter.get("/auth/customer/current", customerControllers.get);
customerRouter.put("/auth/customer/current", customerControllers.update);
customerRouter.delete("/auth/customer/current", customerControllers.logout);

customerRouter.get("/category", categoryControllers.getAll);
customerRouter.get("/category/:id", categoryControllers.getById);
customerRouter.get("/menu", menuControllers.getAllFromCustomer);
customerRouter.put("/menu/favorite/:id", menuControllers.setFavorite);
customerRouter.get("/menu/:id", menuControllers.getById);
customerRouter.get("/menu/:id/rating", menuControllers.getRateById);

customerRouter.get("/order", orderControllers.getAllInCustomer);
customerRouter.get("/order/:id", orderControllers.getByIdFromCustomer);
customerRouter.get("/order/:id/details", orderControllers.getByIdDetails);
customerRouter.post("/order/:id/rate", orderControllers.rateOrder);
customerRouter.put("/order/:id", orderControllers.updateFromCustomer);
customerRouter.post("/order", orderControllers.create);

customerRouter.get("/table", tableControllers.getAll);

customerRouter.get("/voucher", voucherControllers.getAll);
customerRouter.get("/voucher/:code", voucherControllers.getByCode);

customerRouter.get("/reservation", reservationControllers.getAllInCustomer);
customerRouter.get("/reservation/:id", reservationControllers.getById);
customerRouter.post("/reservation", reservationControllers.createFromCustomer);

customerRouter.get("/cart", cartControllers.getAll);
customerRouter.post("/cart", cartControllers.create);
customerRouter.put("/cart/:id", cartControllers.update);
customerRouter.delete("/cart/:id", cartControllers.remove);
