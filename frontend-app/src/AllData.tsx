import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaInfo, FaPlus } from 'react-icons/fa';
import './App.css';

interface Ticket {
    ticketid: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    created_on: Date;
}

const AllData: React.FC = () => {
    const [allData, setAllData] = useState<any[]>([]);
    const navigate = useNavigate();

    const details = (ticketid: number) => {
        navigate("/Details/" + ticketid)

    }
    const edit = (ticketid: number) => {
        navigate("/Edit/" + ticketid)
    }

    const handleDelete = (ticketid: number) => {
        fetch('http://localhost:3006/tickets/' + ticketid, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    // Remove the deleted ticket from the state
                    const updatedData = allData.filter((ticket) => ticket.ticketid !== ticketid);
                    setAllData(updatedData);
                } else {
                    throw new Error("Failed to delete the ticket.");
                }
            })
            .catch((error) => {
                console.log("Error deleting the ticket:", error.message);
            });
    };



    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = e.target.value;
        setSelectedStatus(selectedStatus === 'All' ? '' : selectedStatus);
    };


    const [statusList, setStatusList] = useState<string[]>([]);
    const [searchQueryValue, setSearchQueryValue] = useState('');


    useEffect(() => {
        fetch("http://localhost:3006/status")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setStatusList(data);
                } else {
                    console.log("Invalid data type for status options");
                }
                console.log(data);
            })
            .catch((error) => {
                console.log("Error fetching status options:", error.message);
            });
    }, []);
    // filter the records based on status 
    useEffect(() => {
        let apiUrl = "http://localhost:3006/tickets?_sort=-created_on";

        if (selectedStatus !== '') {
            apiUrl += `&status=${selectedStatus}`;
        }
        if (searchQueryValue) {
            apiUrl += `&title=${searchQueryValue}&description=${searchQueryValue}`;
        }
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => setAllData(data))
            .catch((error) => {
                console.log("Error fetching tickets:", error.message);
            });
    }, [selectedStatus, searchQueryValue]);



    const formatDate = (dateString: string) => {
        const options :any = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (dateString: string) => {
        const options:any = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(dateString).toLocaleTimeString('en-US', options);
    };

    const searchInputRef = useRef<HTMLInputElement>(null);

    const [searchValue, setSearchValue] = useState<string>('');

    const handleSearch = () => {
        let apiUrl = "http://localhost:3006/tickets?_sort=-created_on";

        if (selectedStatus !== '') {
            apiUrl += `&status=${selectedStatus}`;
        }
        const searchQueryValue = searchInputRef.current?.value; // Get the search query from the input field

        if (searchQueryValue) {
            apiUrl += `&title=${searchQueryValue}&description=${searchQueryValue}`;
        }

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log("Response data:", data);
                // Filter the data based on the search query
                const filteredData = data.filter((curUser: any) => {
                    if (selectedStatus && selectedStatus !== 'All' && curUser.status !== selectedStatus) {
                        return false;
                    }
                    if (searchQueryValue) {
                        const titleMatch = curUser.title.toLowerCase().includes(searchQueryValue.toLowerCase());
                        const descMatch = curUser.description.toLowerCase().includes(searchQueryValue.toLowerCase());
                        if (!titleMatch && !descMatch) {
                            return false;
                        }
                    }
                    return true;
                })
                setAllData(filteredData)
            })
            .catch((error) => {
                console.log("Error fetching tickets:", error.message);
            });
        console.log('Search value:', searchValue);

    };

    const filteredTicketCount = allData.filter((curUser: Ticket) => {
        if (selectedStatus && selectedStatus !== 'All' && curUser.status !== selectedStatus) {
            return false;
        }
        if (searchQueryValue) {
            const titleMatch = curUser.title.toLowerCase().includes(searchQueryValue.toLowerCase());
            const descMatch = curUser.description.toLowerCase().includes(searchQueryValue.toLowerCase());
            if (!titleMatch && !descMatch) {
                return false;
            }
        }
        return true;
    }).length;

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center', marginTop: '5px' }}> Welcome to Ticket Management System</h2>

            <div className="card" style={{ marginTop: '30px' }}>
                <div className="card-title">
                    <h2 style={{ textAlign: 'center' }}> Ticket List</h2>

                </div>
                {allData.length === 0 ? (
                    <div className="card-body">

                        <div style={{ textAlign: 'center' }}>
                            <p><b>No tickets found. Create a ticket.</b></p>
                            <div>
                                <br />
                                <div style={{ marginBottom: '5px' }} className="searchAndFilter">
                                    <div className="searchBar">
                                        <input className="search" type="text" name="search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                                            ref={searchInputRef} />
                                        <button className="srcbtn" onClick={handleSearch}><b>Search</b></button>
                                    </div>

                                    <div className="filter" style={{ float: 'right' }} >
                                        <label htmlFor="statusFilter">Filter by:</label>
                                        <select required name="status" value={selectedStatus} onChange={handleStatusChange}>
                                            <option>All</option>
                                            {statusList.length > 0 && statusList.map((status) => (
                                                <option>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>
                            < button className="B2" style={{ float: 'left' }}>
                                <Link className="addData" to="/PostData"><FaPlus /></Link>
                            </button>
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <td>Ticket Id</td>
                                        <td>Title</td>
                                        <td>Description</td>
                                        <td>Status</td>
                                        <td>Priority</td>
                                        <td>Date</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                    </div>

                ) : (
                    <>
                        <div className="card-body">
                            <div>
                                <br />
                                <div style={{ marginBottom: '5px' }} className="searchAndFilter">
                                    <div className="searchBar">
                                        <input className="search" type="text" name="search" onChange={(e) => setSearchValue(e.target.value)}
                                            value={searchValue}
                                            ref={searchInputRef} />
                                        <button className="srcbtn" onClick={handleSearch}><b>Search</b></button>
                                    </div>

                                    <div className="filter" style={{ float: 'right' }} >
                                        <label htmlFor="statusFilter">Filter by:</label>
                                        <select required name="status" value={selectedStatus} onChange={handleStatusChange}>
                                            <option>All</option>
                                            {statusList.length > 0 && statusList.map((status) => (
                                                <option>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ float: 'right', marginRight: '10px', backgroundColor: 'black', color: '#fff', borderRadius: '5px', padding: '5px' }}>
                                        <p style={{ margin: '0' }}><b>Total Tickets:</b> {filteredTicketCount} </p>
                                    </div>


                                </div>

                            </div>
                            < button className="B2">
                                <Link className="addData" to="/PostData"><FaPlus /></Link>
                            </button>
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <td>Ticket Id</td>
                                        <td>Title</td>
                                        <td>Description</td>
                                        <td>Status</td>
                                        <td>Priority</td>
                                        <td>Date</td>
                                        <td>Action</td>
                                    </tr>

                                </thead>
                                <tbody>

                                    {allData.filter((curUser: Ticket) => {
                                        if (selectedStatus && selectedStatus !== 'All' && curUser.status !== selectedStatus) {
                                            return false;
                                        }
                                        if (searchQueryValue) {
                                            const titleMatch = curUser.title.toLowerCase().includes(searchQueryValue.toLowerCase());
                                            const descMatch = curUser.description.toLowerCase().includes(searchQueryValue.toLowerCase());
                                            if (!titleMatch && !descMatch) {
                                                return false;
                                            }
                                        }

                                        return true;

                                    }).map((curUser) => {
                                        const { ticketid, title, description, status, priority, created_on } = curUser;

                                        return (
                                            <tr key={ticketid}>
                                                <td>{ticketid}</td>
                                                <td>{title}</td>
                                                <td>{description}</td>
                                                <td>{status}</td>
                                                <td>{priority}</td>
                                                <td>{`${formatDate(created_on)} ${formatTime(created_on)}`}</td>
                                                <td>
                                                    <button onClick={() => edit(ticketid)} className="btn btn-success">
                                                        <FaEdit />
                                                    </button>
                                                    <button onClick={() => { handleDelete(ticketid) }} className="btn btn-danger">
                                                        <FaTrash />
                                                    </button>
                                                    <button onClick={() => details(ticketid)} className="btn btn-primary">
                                                        <FaInfo />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>

                            </table>


                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default AllData;
