import React, { useRef, useState, useEffect } from 'react';
import { createJiraTicket } from '../api';

export default function TicketModal({ userData, ticketLink, setTicketLink }) {
    const closeButtonRef = useRef(null);
    const [summary, setSummary] = useState('');
    const [priority, setPriority] = useState('Low');
    const [collection, setCollection] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState(window.location.href);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userData) {
            setEmail(userData.email);
            setName(userData.username);
        }
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const data = { name, email, summary, priority, collection, link };
        try {
            const response = await createJiraTicket(data);
            alert('Ticket created successfully: ' + response.data.key);
            setTicketLink(`${process.env.JIRA_INSTANCE}/browse/${response.data.key}`);
            closeButtonRef.current.click();
        } catch (err) {
            setError('Failed to create the ticket. Please try again.');
        }
    };

    return (
        <div>
            <div
                className="modal fade"
                id="reportmodal"
                data-bs-backdrop="static"
                tabIndex="-1"
                aria-labelledby="reportmodalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="reportmodalLabel">Create Support Ticket</h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                ref={closeButtonRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="summary"
                                        name="summary"
                                        className="form-control"
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        required
                                    />
                                    <label className="form-label" htmlFor="summary">Summary<span className="text-danger">*</span></label>
                                </div>
                                <div className="form-outline mb-4">
                                    <select
                                        className="form-control"
                                        id="priority"
                                        name="priority"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        required
                                    >
                                        <option value="Highest">Highest</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                        <option value="Lowest">Lowest</option>
                                    </select>
                                    <label className="form-label" htmlFor="priority">Priority<span className="text-danger">*</span></label>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="collection"
                                        name="collection"
                                        className="form-control"
                                        value={collection}
                                        onChange={(e) => setCollection(e.target.value)}
                                    />
                                    <label className="form-label" htmlFor="collection">Collection</label>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        value={email}
                                        disabled
                                    />
                                    <label className="form-label" htmlFor="email">Email</label>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={name}
                                        disabled
                                    />
                                    <label className="form-label" htmlFor="name">Name</label>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="link"
                                        name="link"
                                        className="form-control"
                                        value={link}
                                        disabled
                                    />
                                    <label className="form-label" htmlFor="link">Link</label>
                                </div>
                                {error && <div className="text-danger mb-3">{error}</div>}
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                                {ticketLink && (
                                    <div className="mt-3">
                                        <a href={ticketLink} target="_blank" rel="noopener noreferrer">View Your Ticket in Jira</a>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
