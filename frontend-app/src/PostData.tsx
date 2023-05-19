import { useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from 'react-icons/fa';

interface Ticket {
    ticketid: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    created_on: Date;
}


const PostData:React.FC = ():JSX.Element => {

    const [title, titlechange] = useState("");
    const [description, descriptionchange] = useState("");
    const [status, setStatus] = useState("Open");
    const [priority, setPriority] = useState("High");
    const[validation,valChange] =useState(false);
    const navigate = useNavigate()

    const [statusList, setStatusList] = useState<string[]>([]);

    useEffect(() => {
      fetch('http://localhost:3006/status')
        .then(response => response.json())
        .then(data => setStatusList(data));
        
    }, []);
    const handleStatusChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
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
      


    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tdata = { title, description, status, priority }
        fetch('http://localhost:3006/tickets', {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(tdata)
    
        }).then((res) => {
            if(res.ok) {
                alert('Saved');
                navigate('/');
            } else {
                throw new Error('Network response was not ok');
            }
        }).catch((err) => {
            console.log(err.message);
            alert('Error: Data not saved. Please try again later.');
        })
    }
    
    const [priorityList, setPriorityList] = useState<string[]>([]);

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
  
    // e.target.value is property that returns the value of the input field 
    return (
        <>
        <Link to="/" className="btn btn-danger" style={{ marginLeft: '15px' ,float:'left',marginTop:'10px' }}>
                <FaArrowLeft />
            </Link>

        <div className="row">
<div className="offset-lg-3 col-lg-6">
<h3 style={{textAlign:'center',marginTop:'5px'}}> Welcome to Ticket Management System</h3>

    
    <form className="container" onSubmit={handleSubmit}>

        
    <div className="card" style={{ marginTop: '30px' }}>
            <div className="card title">
            <h3 style={{ textAlign: 'center' }}>Add New Ticket</h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className=" col-lg-12">
                        <div>
                   
                    <label>Title</label>
                    <br />
                    <input className="form-control" required value={title} onMouseDown={e => valChange(true)} onChange={e => titlechange(e.target.value)} type="text" name="title" />
                   { title.length===0 && validation && <span className="text-danger">Enter the Title </span>}
                    <br />
                    <label>Description</label>
                    <br />
                    <input className="form-control" required value={description} onMouseDown={e => valChange(true)} onChange={e => descriptionchange(e.target.value)} type="text " name="description" />
                    { description.length===0 && validation && <span className="text-danger">Enter the Description </span>}

                    <br />
                    <label>Status </label>
                    <br />
                    <select required name="status" value={status} onChange={handleStatusChange} className="form-control">
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
                    <select required name="priority" value={priority} onChange={(e)=> setPriority(e.target.value)} className="form-control">
                    <option>Select a priority</option>
                    {priorityList.length > 0 && priorityList.map((priority:string) => (
                        (
                            (<option>{priority}</option>)

                        )
                    ))}
                </select>
                    <br />
                    <button className="btn btn-success" type="submit" style={{ marginRight:'15px' }}>
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
export default PostData;