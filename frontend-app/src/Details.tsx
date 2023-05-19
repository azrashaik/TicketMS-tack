import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";


interface Ticket {
    ticketid: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    created_on: string;
}
const Details:React.FC = ():JSX.Element => {
    const { tid } = useParams<{ tid: any }>();
    const [tdata, setTdata] = useState<Ticket>({
        ticketid: 0,
        title: '',
        description: '',
        status: '',
        priority: '',
        created_on: ''
      });;
    const formatDate = (dateString:string):string => {
        const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (dateString:string) => {
        const options:any = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(dateString).toLocaleTimeString('en-US', options);
    };


    useEffect(() => {
        fetch("http://localhost:3006/tickets/" + tid)
            .then((res) => res.json())
            .then((resp) => {
                console.log(resp); // Log the response to see what data is being returned
                setTdata(resp)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [tid]);

    console.log(tdata); // Log the tdata state to see what data is being stored in it

    return (
        <>
            <Link to="/" className="btn btn-danger" style={{ marginLeft: '15px', float: 'left', marginTop: '10px' }}>
                <FaArrowLeft />
            </Link>
            <div className="row">
                <div className="offset-lg-3 col-lg-6">
                    <h3 style={{ textAlign: 'center' }}> Welcome to Ticket Management System</h3>

                    <div className="cotainer">
                        <div className="card" style={{ marginTop: '50px' }}>
                            <div className="card-title">
                                <h2 style={{ textAlign: 'center' }}>Ticket Details</h2>
                            </div>
                            <div className="card-body">
                                <table style={{ margin: 'auto' }}>
                                    <tbody>
                                        <tr>
                                            <td><b>Ticket Id:</b></td>
                                            {/* <td>{tdata.ticketid}</td> */}
                                        </tr>
                                        <tr>
                                            <td><b>Title:</b></td>
                                            <td>{tdata.title}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Description:</b></td>
                                            <td>{tdata.description}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Status:</b></td>
                                            <td>{tdata.status}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Priority:</b></td>
                                            <td>{tdata.priority}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Date:</b></td>
                                            <td>{`${formatDate(tdata.created_on)} ${formatTime(tdata.created_on)}`}</td>
                                        </tr>
                                    </tbody>
                                </table>


                            </div>

                        </div>

                    </div>

                </div>

            </div>


        </>
    );
};

export default Details;
