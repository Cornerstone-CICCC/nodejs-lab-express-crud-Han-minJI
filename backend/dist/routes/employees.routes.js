"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const employeeRouter = (0, express_1.Router)();
const employees = [];
/**
 * @route GET /employees
 * @param {Request} - Express request object.
 * @param {Response} - Express response object
 * @returns {void} - Response with employees list
 */
employeeRouter.get("/", (req, res) => {
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
employeeRouter.get("/search", (req, res) => {
    const { firstname } = req.query;
    const results = employees.filter((e) => e.firstname.toLowerCase().includes(firstname.toLowerCase()));
    if (results.length === 0) {
        res.status(404).send("Employee items not found.");
        return;
    }
    res.status(200).json(results);
});
/**
 * Get employee by id
 *
 * @route GET /employee/:id
 * @param { Request } req - Express request object containing id.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with employee by id.
 */
employeeRouter.get("/:id", (req, res) => {
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
employeeRouter.post("/", (req, res) => {
    const { firstname, lastname, age, isMarried } = req.body;
    const newEmployee = {
        id: (0, uuid_1.v4)(),
        firstname,
        lastname,
        age,
        isMarried,
    };
    employees.push(newEmployee);
    res.status(200).json(newEmployee);
});
/**
 * Update employee by id
 *
 * @route PUT /todos/:id
 * @param { Request } - Express request object which contains id param and employee object.
 * @param { Response } - Express response object.
 * @returns { void } - Respond with updated employee object.
 */
employeeRouter.put("/:id", (req, res) => {
    var _a, _b, _c, _d;
    const { id } = req.params;
    const foundIndex = employees.findIndex((e) => e.id === id);
    if (foundIndex === -1) {
        res.status(404).send("Employee item not found");
        return;
    }
    const updateEmployee = Object.assign(Object.assign({}, employees[foundIndex]), { firstname: (_a = req.body.firstname) !== null && _a !== void 0 ? _a : employees[foundIndex].firstname, lastname: (_b = req.body.lastname) !== null && _b !== void 0 ? _b : employees[foundIndex].lastname, age: (_c = req.body.age) !== null && _c !== void 0 ? _c : employees[foundIndex].age, isMarried: (_d = req.body.isMarried) !== null && _d !== void 0 ? _d : employees[foundIndex].isMarried });
    employees[foundIndex] = updateEmployee;
    res.status(201).json(updateEmployee);
});
/**
 * Delete employee by id
 *
 * @route DELETE /todos/:id
 * @param { Request } req - Express request object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with employee by id.
 */
employeeRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    const foundIndex = employees.findIndex((e) => e.id === id);
    if (foundIndex === -1) {
        res.status(404).send("Employee not found");
        return;
    }
    employees.splice(foundIndex, 1);
    res.status(200).send("Employee deleted");
});
exports.default = employeeRouter;
