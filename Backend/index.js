"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(express_1.default.json());
// module.exports = app;
app.listen(3006, () => {
    console.log("server has started on port 3006");
    app.post('/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, description, status, priority } = req.body;
            // Check if request body is empty or required fields are missing
            if (!title || !description || !status || !priority) {
                return res.status(400).json({ error: 'Missing required fields in request body' });
            }
            // Insert new record
            const newData = yield db_1.pool.query('INSERT INTO Tickets (title, description, status, priority) VALUES($1, $2, $3, $4)', [title, description, status, priority]);
            res.json({ message: 'Ticket Added' });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }));
    const statusOptions = ['Open', 'In Progress', 'Completed'];
    app.get('/status', (req, res) => {
        res.json(statusOptions);
    });
    const priorityOptions = ['High', 'Medium', 'Low'];
    app.get('/priority', (req, res) => {
        res.json(priorityOptions);
    });
    app.get('/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { status, title, description } = req.query;
            let query = 'SELECT * FROM Tickets';
            const queryParams = [];
            if (status && status !== 'All') {
                // Filter by status
                query += ' WHERE status = $1';
                queryParams.push(status);
            }
            if (title) {
                // Filter by title
                if (queryParams.length === 0) {
                    query += ' WHERE title ILIKE $1';
                }
                queryParams.push(`%${title}%`);
            }
            if (description) {
                // Filter by description
                if (queryParams.length === 0) {
                    query += ' WHERE description ILIKE $1';
                }
                queryParams.push(`%${description}%`);
            }
            query += ' ORDER BY created_on DESC';
            const getData = yield db_1.pool.query(query, queryParams);
            const filteredTickets = getData.rows;
            res.json(filteredTickets);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }));
    app.get('/tickets/:ticketid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ticketid } = req.params;
            const dataById = yield db_1.pool.query('SELECT * FROM Tickets WHERE ticketid = $1', [ticketid]);
            if (dataById.rows.length === 0) {
                res.status(404).json({ message: 'Ticket ID not found' });
            }
            else {
                res.json(dataById.rows[0]);
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }));
    app.put('/tickets/:ticketid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (Object.keys(req.body).length === 0) {
                // Return an error response if the request body is empty
                return res.status(400).json({ message: 'Empty request body' });
            }
            const { ticketid } = req.params;
            const { priority, title, description } = req.body;
            const checkTicket = yield db_1.pool.query('SELECT ticketid, status FROM Tickets WHERE ticketid = $1', [ticketid]);
            if (checkTicket.rows.length === 0) {
                // Return an error response if ticketid does not exist
                return res.status(404).json({ message: 'Ticket ID does not exist' });
            }
            if (priority !== undefined) {
                yield db_1.pool.query('UPDATE Tickets SET priority = $1 WHERE ticketid = $2', [priority, ticketid]);
            }
            if (title !== undefined) {
                yield db_1.pool.query('UPDATE Tickets SET title = $1 WHERE ticketid = $2', [title, ticketid]);
            }
            if (description !== undefined) {
                yield db_1.pool.query('UPDATE Tickets SET description = $1 WHERE ticketid = $2', [description, ticketid]);
            }
            let updatedTicket = yield db_1.pool.query('SELECT * FROM Tickets WHERE ticketid = $1', [ticketid]);
            res.json({ message: 'Ticket updated', ticket: updatedTicket.rows[0] });
            const currentStatus = checkTicket.rows[0].status;
            const selectedStatus = req.body.status;
            const currentStatusObj = statusOptions.indexOf(currentStatus);
            const selectedStatusObj = statusOptions.indexOf(selectedStatus);
            console.log(currentStatus);
            console.log(selectedStatus);
            if (Math.abs((currentStatusObj) - (selectedStatusObj)) === 1) {
                yield db_1.pool.query('UPDATE Tickets SET status = $1 WHERE ticketid = $2', [selectedStatus, ticketid]);
            }
            else {
                console.log(currentStatus);
                return res.status(400).json({ message: 'Invalid status transition' });
            }
            updatedTicket = yield db_1.pool.query('SELECT * FROM Tickets WHERE ticketid = $1', [ticketid]);
            res.json({ message: 'Ticket updated', ticket: updatedTicket.rows[0] });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }));
    app.delete('/tickets/:ticketid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ticketid } = req.params;
            const deleteTicket = yield db_1.pool.query('DELETE FROM Tickets WHERE ticketid = $1', [ticketid]);
            if (deleteTicket.rowCount === 0) {
                res.status(404).json({ error: `Ticket with ID ${ticketid} does not exist` });
            }
            else {
                res.json({ message: 'Ticket Deleted' });
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server error' });
        }
    }));
});
