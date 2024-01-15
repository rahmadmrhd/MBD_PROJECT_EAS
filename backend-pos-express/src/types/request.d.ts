import Customer from "../resources/customer/customer-model";
import Employee from "../resources/employee/employee-model";
export {};
declare global {
  namespace Express {
    interface Request {
      customer: Customer;
      employee: Employee;
    }
  }
}
