import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import chaiSpies from 'chai-spies';
import {app} from './index';
import {pool} from './db';

 const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSpies);
chai.use(spies);

describe('POST /tickets', () => {
  describe('when required fields are missing in the request body', () => {
    it('should return a 400 Bad Request status code', async () => {
      const res = await chai
        .request(app)
        .post('/tickets')
        .send({});
      expect(res).to.have.status(400);
      chai.spy.restore();
    });
  });

  describe('when a new ticket is successfully added to the database', () => {
    it('should return a 200 OK status code', async () => {
      const res = await chai
        .request(app)
        .post('/tickets')
        .send({
          title: 'Test Ticket',
          description: 'This is a test ticket',
          status: 'Open',
          priority: 'High',
        });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Ticket Added');

      chai.spy.restore();
    });

    it('should return a 500 Internal Server Error status code if an error occurs while inserting the ticket', async () => {
      const errorMessage = 'Database error';
      const querySpy = chai.spy.on(pool, 'query', () => {
        throw new Error(errorMessage);
      });

      const res = await chai
        .request(app)
        .post('/tickets')
        .send({
          title: 'Test Ticket',
          description: 'This is a test ticket',
          status: 'Open',
          priority: 'High',
        });

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Server error');

      chai.spy.restore();
    });
  });
});

  describe('DELETE /tickets/:tickets',()=>{
    describe('it will delete the ticket based on ticket id',()=>{
        it('should delete ticket and return 200 status code', async () => {
            const ticketid = 1;
            chai.spy.on(pool, 'query', () => ({
              rowCount: 1,
            }));
            const res = await chai.request(app).delete(`/tickets/${ticketid}`);
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ message: 'Ticket Deleted' });
            chai.spy.restore();
          });
    })
    it('should return 404 status code if ticket does not exist', async () => {
        const ticketid = 1;
        chai.spy.on(pool, 'query', () => ({
          rowCount: 0,
        }));
        const res = await chai.request(app).delete(`/tickets/${ticketid}`);
        expect(res).to.have.status(404);
        expect(res.body).to.deep.equal({ error: `Ticket with ID ${ticketid} does not exist` });
        chai.spy.restore();
      });
      it('should return 500 status code when an error occurs', async () => {
        const ticketid = 1;
        const errorMessage = 'Database error';
        const spy = chai.spy.on(pool, 'query', () => { throw new Error(errorMessage) });
        const res = await chai.request(app).delete(`/tickets/${ticketid}`);
      
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ error: 'Server error' });
        chai.spy.restore();
      });
      

  });
describe('GET/tickets',()=>{
    it('should get all the tickets when no query parameters are provided',async()=>{
        const rows = [{ ticketid: 1, status: 'Open' }, { ticketid: 2, status: 'Re Open' }];
        const spy = chai.spy.on(pool, 'query', () => ({ rows }));
        const res = await chai.request(app).get('/tickets');
    
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai.spy.restore();
    })
    it('should get tickets with a specific status when "status" query parameter is provided', async () => {
        const rows = [{ ticketid: 1, status: 'Open' }];
        const status = 'Open';
        const spy = chai.spy.on(pool, 'query', () => ({ rows }));
        const res = await chai.request(app).get(`/tickets?status=${status}`);
    
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai.spy.restore();
      });
      it('should get all tickets when "status" query parameter is "All"', async () => {
        const rows = [{ ticketid: 1, status: 'Open' }, { ticketid: 2, status: 'Re Open' }];
        const status = 'All';
        const spy = chai.spy.on(pool, 'query', () => ({ rows }));
        const res = await chai.request(app).get(`/tickets?status=${status}`);
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(rows);
        chai.spy.restore();

      })
        it('should return all tickets when no query parameters are provided', async () => {
          const rows = [{ ticketid: 1, title: 'New ticket', description: 'This is new ticket' }];
          const spy = chai.spy.on(pool, 'query', () => ({ rows }));
          const res = await chai.request(app).get('/tickets');
      
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(rows);
          chai.spy.restore();
        });
      
        it('should filter tickets by title when "title" query parameter is provided', async () => {
          const rows = [{ ticketid: 1, title: 'New ticket', description: 'This is new ticket' }];
          const title = 'New';
          const spy = chai.spy.on(pool, 'query', () => ({ rows }));
          const res = await chai.request(app).get(`/tickets?title=${title}`);
      
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(rows);
          chai.spy.restore();
        });
      
        it('should filter tickets by description when "description" query parameter is provided', async () => {
          const rows = [{ ticketid: 1, title: 'New ticket', description: 'This is new ticket' }];
          const description = 'new';
          const spy = chai.spy.on(pool, 'query', () => ({ rows }));
          const res = await chai.request(app).get(`/tickets?description=${description}`);
      
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(rows);
          chai.spy.restore();
        });
      
      it('should return 500 status code when an error occurs', async () => {
        const errorMessage = 'Database error';
        const spy = chai.spy.on(pool, 'query', () => { throw new Error(errorMessage) });
        const res = await chai.request(app).get('/tickets');
    
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ error: 'Server error' });
        chai.spy.restore();
      });
    });

describe('GET/tickets/:ticketid',()=>{
    it('should retrieve ticket by ID when it exists', async () => {
        const ticketid = 1;
        const ticketData = { id: ticketid, status: 'Open' };
        const spy = chai.spy.on(pool, 'query', () => ({ rows: [ticketData] }));
        const res = await chai.request(app).get(`/tickets/${ticketid}`);
    
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(ticketData);
        chai.spy.restore();
    });
    
      it('should return 404 status code when ticket ID does not exist', async () => {
        const ticketid = 1;
        const spy = chai.spy.on(pool, 'query', () => ({ rows: [] }));
        const res = await chai.request(app).get(`/tickets/${ticketid}`);
    
        expect(res).to.have.status(404);
        expect(res.body).to.deep.equal({ message: 'Ticket ID not found' });
        chai.spy.restore();
    });
    
      it('should return 500 status code when an error occurs', async () => {
        const ticketid = 1;
        const errorMessage = 'Database error';
        const spy = chai.spy.on(pool, 'query', () => { throw new Error(errorMessage) });
         const res = await chai.request(app).get(`/tickets/${ticketid}`);
    
        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: 'Server error' });
        chai.spy.restore();
    });

});

describe('GET/status', () => {
  it('should return an array of status options', async () => {
    const res = await chai.request(app).get('/status');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.includes.members(['Open', 'In Progress', 'Completed']);
    chai.spy.restore();
  });
});


describe('GET/priority', () => {
  it('should return an array of priority options', async () => {
    const res = await chai.request(app).get('/priority');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.includes.members(['High', 'Medium', 'Low']);
    chai.spy.restore();
  });
});

describe('PUT /tickets/:ticketid', () => {
  afterEach(() => {
    chai.spy.restore();
  });
  it('should return a 400 error if the request body is empty', async () => {
    const ticketid = 1;
    const updateData = {};
    const res = await chai.request(app)
      .put(`/tickets/${ticketid}`)
      .send(updateData);
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('message').to.eql('Empty request body');
  });

  it('should return a 404 error if the ticketid does not exist', async () => {
    const ticketid = 999;
    const updateData = {
      status: 'in progress',
    };
    const res = await chai.request(app)
      .put(`/tickets/${ticketid}`)
      .send(updateData);
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message').to.eql('Ticket ID does not exist');
  });
  it('should update the ticket with the given ticketid', async () => {
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
    chai.spy.on(pool, 'query', () => Promise.resolve({ rows: [updatedTicket] }));
    const res = await chai.request(app)
      .put(`/tickets/${ticketid}`)
      .send(updateData);
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal({ message: 'Ticket updated', ticket: updatedTicket });
  });
  
 
  it('should return a 500 error if the update operation fails', async () => {
    const ticketid = 1;
    const updateData = {
      status: 'in progress',
    };
    chai.spy.on(pool, 'query', () => { throw new Error('Database error') });
    const res = await chai.request(app)
      .put(`/tickets/${ticketid}`)
      .send(updateData);
    expect(res).to.have.status(500);
    expect(res.body).to.deep.equal({ message: 'Server error' });
  });
  
  


  });




 
  


  
  
  
  
  
  
  

  

  