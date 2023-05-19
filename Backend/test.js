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
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const chai_spies_1 = __importDefault(require("chai-spies"));
const chai_spies_2 = __importDefault(require("chai-spies"));
const index_1 = require("./index");
const db_1 = require("./db");
const { expect } = chai_1.default;
chai_1.default.use(chai_http_1.default);
chai_1.default.use(chai_spies_2.default);
chai_1.default.use(chai_spies_1.default);
describe('POST /tickets', () => {
    describe('when required fields are missing in the request body', () => {
        it('should return a 400 Bad Request status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield chai_1.default
                .request(index_1.app)
                .post('/tickets')
                .send({});
            expect(res).to.have.status(400);
            chai_1.default.spy.restore();
        }));
    });
    describe('when a new ticket is successfully added to the database', () => {
        it('should return a 200 OK status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield chai_1.default
                .request(index_1.app)
                .post('/tickets')
                .send({
                title: 'Test Ticket',
                description: 'This is a test ticket',
                status: 'Open',
                priority: 'High',
            });
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Ticket Added');
            chai_1.default.spy.restore();
        }));
        it('should return a 500 Internal Server Error status code if an error occurs while inserting the ticket', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'Database error';
            const querySpy = chai_1.default.spy.on(db_1.pool, 'query', () => {
                throw new Error(errorMessage);
            });
            const res = yield chai_1.default
                .request(index_1.app)
                .post('/tickets')
                .send({
                title: 'Test Ticket',
                description: 'This is a test ticket',
                status: 'Open',
                priority: 'High',
            });
            expect(res).to.have.status(500);
            expect(res.body.error).to.equal('Server error');
            chai_1.default.spy.restore();
        }));
    });
});
describe('DELETE /tickets/:tickets', () => {
    describe('it will delete the ticket based on ticket id', () => {
        it('should delete ticket and return 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const ticketid = 1;
            chai_1.default.spy.on(db_1.pool, 'query', () => ({
                rowCount: 1,
            }));
            const res = yield chai_1.default.request(index_1.app).delete(`/tickets/${ticketid}`);
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ message: 'Ticket Deleted' });
            chai_1.default.spy.restore();
        }));
    });
    it('should return 404 status code if ticket does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        chai_1.default.spy.on(db_1.pool, 'query', () => ({
            rowCount: 0,
        }));
        const res = yield chai_1.default.request(index_1.app).delete(`/tickets/${ticketid}`);
        expect(res).to.have.status(404);
        expect(res.body).to.deep.equal({ error: `Ticket with ID ${ticketid} does not exist` });
        chai_1.default.spy.restore();
    }));
    it('should return 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const errorMessage = 'Database error';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => { throw new Error(errorMessage); });
        const res = yield chai_1.default.request(index_1.app).delete(`/tickets/${ticketid}`);
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ error: 'Server error' });
        chai_1.default.spy.restore();
    }));
});
describe('GET/tickets', () => {
    it('should get all the tickets when no query parameters are provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const rows = [{ ticketid: 1, status: 'Open' }, { ticketid: 2, status: 'Re Open' }];
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows }));
        const res = yield chai_1.default.request(index_1.app).get('/tickets');
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai_1.default.spy.restore();
    }));
    it('should get tickets with a specific status when "status" query parameter is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const rows = [{ ticketid: 1, status: 'Open' }];
        const status = 'Open';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows }));
        const res = yield chai_1.default.request(index_1.app).get(`/tickets?status=${status}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai_1.default.spy.restore();
    }));
    it('should get all tickets when "status" query parameter is "All"', () => __awaiter(void 0, void 0, void 0, function* () {
        const rows = [{ ticketid: 1, status: 'Open' }, { ticketid: 2, status: 'Re Open' }];
        const status = 'All';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows }));
        const res = yield chai_1.default.request(index_1.app).get(`/tickets?status=${status}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai_1.default.spy.restore();
    }));
    it('should return all tickets when no query parameters are provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const rows = [{ ticketid: 1, title: 'New ticket', description: 'This is new ticket' }];
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows }));
        const res = yield chai_1.default.request(index_1.app).get('/tickets');
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai_1.default.spy.restore();
    }));
    it('should filter tickets by title when "title" query parameter is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const rows = [{ ticketid: 1, title: 'New ticket', description: 'This is new ticket' }];
        const title = 'New';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows }));
        const res = yield chai_1.default.request(index_1.app).get(`/tickets?title=${title}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai_1.default.spy.restore();
    }));
    it('should filter tickets by description when "description" query parameter is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const rows = [{ ticketid: 1, title: 'New ticket', description: 'This is new ticket' }];
        const description = 'new';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows }));
        const res = yield chai_1.default.request(index_1.app).get(`/tickets?description=${description}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai_1.default.spy.restore();
    }));
    it('should return 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = 'Database error';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => { throw new Error(errorMessage); });
        const res = yield chai_1.default.request(index_1.app).get('/tickets');
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ error: 'Server error' });
        chai_1.default.spy.restore();
    }));
});
describe('GET/tickets/:ticketid', () => {
    it('should retrieve ticket by ID when it exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const ticketData = { id: ticketid, status: 'Open' };
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows: [ticketData] }));
        const res = yield chai_1.default.request(index_1.app).get(`/tickets/${ticketid}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(ticketData);
        chai_1.default.spy.restore();
    }));
    it('should return 404 status code when ticket ID does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => ({ rows: [] }));
        const res = yield chai_1.default.request(index_1.app).get(`/tickets/${ticketid}`);
        expect(res).to.have.status(404);
        expect(res.body).to.deep.equal({ message: 'Ticket ID not found' });
        chai_1.default.spy.restore();
    }));
    it('should return 500 status code when an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const errorMessage = 'Database error';
        const spy = chai_1.default.spy.on(db_1.pool, 'query', () => { throw new Error(errorMessage); });
        const res = yield chai_1.default.request(index_1.app).get(`/tickets/${ticketid}`);
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: 'Server error' });
        chai_1.default.spy.restore();
    }));
});
describe('GET/status', () => {
    it('should return an array of status options', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield chai_1.default.request(index_1.app).get('/status');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.includes.members(['Open', 'In Progress', 'Completed']);
        chai_1.default.spy.restore();
    }));
});
describe('GET/priority', () => {
    it('should return an array of priority options', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield chai_1.default.request(index_1.app).get('/priority');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.includes.members(['High', 'Medium', 'Low']);
        chai_1.default.spy.restore();
    }));
});
describe('PUT /tickets/:ticketid', () => {
    afterEach(() => {
        chai_1.default.spy.restore();
    });
    it('should return a 400 error if the request body is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const updateData = {};
        const res = yield chai_1.default.request(index_1.app)
            .put(`/tickets/${ticketid}`)
            .send(updateData);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message').to.eql('Empty request body');
    }));
    it('should return a 404 error if the ticketid does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 999;
        const updateData = {
            status: 'in progress',
        };
        const res = yield chai_1.default.request(index_1.app)
            .put(`/tickets/${ticketid}`)
            .send(updateData);
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message').to.eql('Ticket ID does not exist');
    }));
    it('should update the ticket with the given ticketid', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const updateData = {
            priority: 'Low',
            title: 'Title',
            description: 'Description'
        };
        const updatedTicket = {
            ticketid: 1,
            priority: 'High',
            title: 'New Title',
            description: 'New Description'
        };
        chai_1.default.spy.on(db_1.pool, 'query', () => Promise.resolve({ rows: [updatedTicket] }));
        const res = yield chai_1.default.request(index_1.app)
            .put(`/tickets/${ticketid}`)
            .send(updateData);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Ticket updated', ticket: updatedTicket });
    }));
    it('should return a 500 error if the update operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const ticketid = 1;
        const updateData = {
            status: 'in progress',
        };
        chai_1.default.spy.on(db_1.pool, 'query', () => { throw new Error('Database error'); });
        const res = yield chai_1.default.request(index_1.app)
            .put(`/tickets/${ticketid}`)
            .send(updateData);
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: 'Server error' });
    }));
});
