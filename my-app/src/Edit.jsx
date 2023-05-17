import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from 'react-icons/fa';




const Edit = () => {
    const { tid } = useParams();

    const [ticketid, setTicketId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [created_on, setCreated_on] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3006/tickets/" + tid)
            .then((res) => res.json())
            .then((resq) => {
                console.log('resq',resq)
                setTicketId(resq.ticketid);
                setTitle(resq.title);
                setDescription(resq.description);
                setStatus(resq.status);
                setPriority(resq.priority);
                setCreated_on(resq.created_on);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [tid]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const tdata = {
            ticketid,
            title,
            description,
            status,
            priority,
    created_on: new Date().toISOString()
        };
        console.log("tdata:",tdata);

        fetch("http://localhost:3006/tickets/" + tid, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(tdata),
        }).then((res) => {
            if (res.ok) {
                alert('Saved');
                navigate('/');
            } else {
                throw new Error('Network response was not ok');
            }
        }).catch((err) => {
            console.log(err.message);
            alert('Error: Data not saved. Please try again later.');
        })
    };
    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
      fetch('http://localhost:3006/status')
        .then(response => response.json())
        .then(data => setStatusList(data));
        
    }, []);
    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
      
        // Find the index of the current status and the selected status in the status list
        const currentIndex = statusList.indexOf(status);
        const selectedIndex = statusList.indexOf(selectedStatus);
        console.log(currentIndex)
        console.log(selectedIndex)
        console.log(statusList)
      
        // Check if the transition is valid
        if (Math.abs(selectedIndex - currentIndex) === 1) {
          setStatus(selectedStatus);
        } else {
          alert("Invalid status transition");
        }
      };
      
    const [priorityList, setPriorityList] = useState({});

    useEffect(() => {
        fetch("http://localhost:3006/status")
            .then((response) => response.json())
            .then((data) => {
               
                console.log(data)
                setStatusList(data)
            })
            .catch((error) => {
                console.log("Error fetching status options:", error.message);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:3006/priority")
            .then((response) => response.json())
            .then((data) => {
                
                console.log(data)
                setPriorityList(data)
            })
            .catch((error) => {
                console.log("Error fetching priority options:", error.message);
            });
    }, []);

    return (
        <>
            <Link to="/" className="btn btn-danger" style={{ marginLeft: '15px', float: 'left', marginTop: '10px' }}>
                <FaArrowLeft />
            </Link>
            <div className="row">
                <div className="offset-lg-3 col-lg-6">
                    <h3 style={{ textAlign: 'center', marginTop: '5px' }}> Welcome to Ticket Management System</h3>

                    <form className="container" onSubmit={handleSubmit}>
                        <div className="card" style={{ marginTop: '50px' }}>
                            <div className="card title">
                                <h3 style={{ textAlign: 'center' }}>Update Ticket</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className=" col-lg-12">
                                        <div>
                                               
                                                <label>Title</label>
                                                <br />
                                                <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} type="text" name="title" />
                                                <br />
                                                <label>Description</label>
                                                <br />
                                                <input className="form-control" value={description} onChange={e => setDescription(e.target.value)} type="text " name="description" />
                                                <br />

                                                <label>Status </label>
                                                <br />
                                                <select name="status" value={status} onChange={handleStatusChange} className="form-control">
                                                    <option>Select a status</option>
                                                    {statusList.length > 0 && statusList.map((status) => (
                                                        (
                                                            (<option>{status}</option>)
                                                        )
                                                    ))}
                                                </select>

                                                <br />
                                                <label>Priority</label>
                                                <br />
                                                <select name="priority" value={priority} onChange={e => setPriority(e.target.value)} className="form-control">
                                                    <option>Select a priority</option>
                                                    {priorityList.length > 0 && priorityList.map((priority) => (
                                                        (
                                                            (<option>{priority}</option>)

                                                        )
                                                    ))}
                                                </select>
                                                <br />
                                                <button className="btn btn-success" type="submit" style={{ marginRight: '15px' }} onClick={handleSubmit}>
                                                    <FaSave />
                                                </button>


                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </>

    )
}
export default Edit;