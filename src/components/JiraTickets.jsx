import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getJiraTicket } from '../api';

export default function JiraTickets({ userData }) {
    const [userTickets, setUserTickets] = useState([]);

    useEffect(() => {
        if (userData) {
            fetchJiraTickets();
        }
    }, [userData]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'text-primary';
            case 'in progress':
                return 'text-warning';
            case 'rejected':
                return 'text-danger';
            case 'fixed':
                return 'text-success';
            default:
                return 'text-muted';
        }
    };

    const fetchJiraTickets = async () => {
        const email = userData.email;
        try {
            const response = await getJiraTicket(email);
            console.log(response.data);
            setUserTickets(response.data.tickets);
        } catch (error) {
            console.error('error getting user tickets', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                {userData && (userData.status === 'active' && (userData.role === 'admin' || userData.id === id)) ? (
                    <>
                        <div className="row pt-3">
                            <div className="col-sm-9">
                                <p className="text-muted mb-0 text-capitalize">Summary</p>
                            </div>
                            <div className="col-sm-3">
                                <p className="mb-0 text-capitalize">Status</p>
                            </div>
                        </div>
                        <hr />
                        {userTickets.length > 0 ? (
                            userTickets.map((ticket) => (
                                <React.Fragment key={ticket.link}>
                                    <div className="row pt-3">
                                        <div className="col-sm-9">
                                            <a className="text-muted mb-0 text-capitalize" href={ticket.link}>
                                                {ticket.summary}
                                            </a>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className={`mb-0 text-capitalize ${getStatusColor(ticket.status ? ticket.status.value : 'closed')}`}>
                                                {ticket.status ? ticket.status.value : 'closed'}
                                            </p>
                                        </div>
                                    </div>
                                    <hr />
                                </React.Fragment>
                            ))
                        ) : (
                            <p className="text-center text-muted">No tickets found.</p>
                        )}
                    </>
                ) : (
                    <p className="text-center text-muted">You do not have access to view tickets.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}
