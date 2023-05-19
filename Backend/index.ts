import express, { Request, Response } from 'express';
import cors from "cors";
import { pool } from './db';

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// module.exports = app;


  app.listen(3006, () => {
  console.log("server has started on port 3006");


  app.post('/tickets', async (req:Request, res:Response) => {
    try {
      const { title, description, status, priority } = req.body;

      // Check if request body is empty or required fields are missing
      if (!title || !description || !status || !priority) {

        return res.status(400).json({ error: 'Missing required fields in request body' });
      }
      // Insert new record
      const newData = await pool.query(
        'INSERT INTO Tickets (title, description, status, priority) VALUES($1, $2, $3, $4)',
        [title, description, status, priority]
      );
      res.json({ message: 'Ticket Added' });

    } catch (err:any) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });


  const statusOptions = ['Open', 'In Progress', 'Completed'];

  app.get('/status', (req:Request, res:Response) => {
      res.json(statusOptions);

  });

  const priorityOptions = ['High', 'Medium', 'Low'];

app.get('/priority', (req, res) => {
  res.json(priorityOptions);
});



app.get('/tickets', async (req:Request, res:Response) => {
  try {
    const { status, title, description } = req.query;

    let query = 'SELECT * FROM Tickets';
    const queryParams = [];
    let isFiltered = false; // Flag variable


    if (status && status !== 'All') {
      // Filter by status
      query += ' WHERE status = $1';
      queryParams.push(status);
      let isFiltered = true; // Flag variable

    }
    if (title && !isFiltered) {
      // Filter by title if not already filtered
      query += ' WHERE title ILIKE $1';
      queryParams.push(`%${title}%`);
      isFiltered = true;
    } else if (description && !isFiltered) {
      // Filter by description if not already filtered
      query += ' WHERE description ILIKE $1';
      queryParams.push(`%${description}%`);
      isFiltered = true;
    }


    query += ' ORDER BY created_on DESC';

    const getData = await pool.query(query, queryParams);
    const filteredTickets = getData.rows;
    res.json(filteredTickets);
  } catch (err:any) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
  app.get('/tickets/:ticketid', async (req:Request, res:Response) => {
    try {
      const { ticketid } = req.params;
      const dataById = await pool.query('SELECT * FROM Tickets WHERE ticketid = $1', [ticketid]);

      if (dataById.rows.length === 0) {
        res.status(404).json({ message: 'Ticket ID not found' });
      } else {
        res.json(dataById.rows[0]);
      }
    } catch (err:any) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  app.put('/tickets/:ticketid', async (req:Request, res:Response) => {
    try {
      if (Object.keys(req.body).length === 0) {
        // Return an error response if the request body is empty
        return res.status(400).json({ message: 'Empty request body' });
      }
      const { ticketid } = req.params;
      const {  priority, title, description } = req.body;


      const checkTicket = await pool.query('SELECT ticketid, status FROM Tickets WHERE ticketid = $1', [ticketid]);

      if (checkTicket.rows.length === 0) {
        // Return an error response if ticketid does not exist
        return res.status(404).json({ message: 'Ticket ID does not exist' });
      }
      
      if (priority !== undefined) {
        await pool.query('UPDATE Tickets SET priority = $1 WHERE ticketid = $2', [priority, ticketid]);
      }

      if (title !== undefined) {
        await pool.query('UPDATE Tickets SET title = $1 WHERE ticketid = $2', [title, ticketid]);
      }

      if (description !== undefined) {
        await pool.query('UPDATE Tickets SET description = $1 WHERE ticketid = $2', [description, ticketid]);
      }
      let updatedTicket = await pool.query('SELECT * FROM Tickets WHERE ticketid = $1', [ticketid]);

      res.json({ message: 'Ticket updated', ticket: updatedTicket.rows[0] });

      const currentStatus = checkTicket.rows[0].status;
      const selectedStatus = req.body.status;

      const currentStatusObj = statusOptions.indexOf(currentStatus);
      const selectedStatusObj = statusOptions.indexOf(selectedStatus);
      console.log(currentStatus)
      console.log(selectedStatus)

      if(Math.abs((currentStatusObj) - (selectedStatusObj))=== 1)
      {

        await pool.query('UPDATE Tickets SET status = $1 WHERE ticketid = $2', [selectedStatus, ticketid]);

      } else{
        console.log(currentStatus)
        return res.status(400).json({ message: 'Invalid status transition' });
        

      }

  updatedTicket = await pool.query('SELECT * FROM Tickets WHERE ticketid = $1', [ticketid]);

      res.json({ message: 'Ticket updated', ticket: updatedTicket.rows[0] });
    } catch (err:any) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/tickets/:ticketid', async (req:Request, res:Response) => {
    try {
      const { ticketid } = req.params;
      const deleteTicket = await pool.query('DELETE FROM Tickets WHERE ticketid = $1', [ticketid]);
      if (deleteTicket.rowCount === 0) {
        res.status(404).json({ error: `Ticket with ID ${ticketid} does not exist` });
      } else {
        res.json({ message: 'Ticket Deleted' });
      }
    } catch (err:any) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' })
    }
  });

});
export { app }
