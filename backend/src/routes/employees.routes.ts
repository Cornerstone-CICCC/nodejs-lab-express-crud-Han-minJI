import { Router, Request, Response } from "express";
import { Employee } from "../types/employee";
import { v4 as uuidv4 } from "uuid";

const employeeRouter = Router();

const employees: Employee[] = [];

/**
 * @route GET /employees
 * @param {Request} - Express request object.
 * @param {Response} - Express response object
 * @returns {void} - Response with employees list
 */
employeeRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json(employees);
});

/**
 * Search employee
 *
 * @route GET /employee/search?firstname=TEST
 * @param { Request } req - Express request object containins the keyword query
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with list of employee results
 */
employeeRouter.get(
  "/search",
  (req: Request<{}, {}, {}, { firstname: string }>, res: Response) => {
    const { firstname } = req.query;
    const results: Employee[] = employees.filter((e) =>
      e.firstname.toLowerCase().includes(firstname.toLowerCase()),
    );

    if (results.length === 0) {
      res.status(404).send("Employee items not found.");
      return;
    }

    res.status(200).json(results);
  },
);

/**
 * Get employee by id
 *
 * @route GET /employee/:id
 * @param { Request } req - Express request object containing id.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with employee by id.
 */
employeeRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const found = employees.find((e) => e.id === id);
  if (!found) {
    res.status(404).send("Employee not found");
    return;
  }
  res.status(202).json(found);
});

/**
 * Add Employee
 *
 * @route POST /
 * @param { Request } req - Express request object containing todo object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with created Employee.
 */
employeeRouter.post(
  "/",
  (req: Request<{}, {}, Omit<Employee, "id">>, res: Response) => {
    const { firstname, lastname, age, isMarried } = req.body;
    const newEmployee: Employee = {
      id: uuidv4(),
      firstname,
      lastname,
      age,
      isMarried,
    };
    employees.push(newEmployee);
    res.status(200).json(newEmployee);
  },
);

/**
 * Update employee by id
 *
 * @route PUT /todos/:id
 * @param { Request } - Express request object which contains id param and employee object.
 * @param { Response } - Express response object.
 * @returns { void } - Respond with updated employee object.
 */
employeeRouter.put(
  "/:id",
  (req: Request<{ id: string }, {}, Partial<Employee>>, res: Response) => {
    const { id } = req.params;
    const foundIndex = employees.findIndex((e) => e.id === id);
    if (foundIndex === -1) {
      res.status(404).send("Employee item not found");
      return;
    }
    const updateEmployee: Employee = {
      ...employees[foundIndex],
      firstname: req.body.firstname ?? employees[foundIndex].firstname,
      lastname: req.body.lastname ?? employees[foundIndex].lastname,
      age: req.body.age ?? employees[foundIndex].age,
      isMarried: req.body.isMarried ?? employees[foundIndex].isMarried,
    };

    employees[foundIndex] = updateEmployee;
    res.status(201).json(updateEmployee);
  },
);

/**
 * Delete employee by id
 *
 * @route DELETE /todos/:id
 * @param { Request } req - Express request object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with employee by id.
 */
employeeRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const foundIndex = employees.findIndex((e) => e.id === id);
  if (foundIndex === -1) {
    res.status(404).send("Employee not found");
    return;
  }
  employees.splice(foundIndex, 1);
  res.status(200).send("Employee deleted");
});

export default employeeRouter;
