import React, { useState, useEffect } from "react";
import TicketModal from "./TicketModal";

export default function Footer({ userData }) {
  const [ticketLink, setTicketLink] = useState("");
  const [linkState, setLinkState] = useState(false);

  useEffect(() => {
    if (ticketLink) {
      setLinkState(true);
      const timer = setTimeout(() => {
        setLinkState(false);
      }, 10000);
      return () => clearTimeout(timer); 
    }
  }, [ticketLink]);

  return (
    <div>
      <TicketModal
        userData={userData}
        ticketLink={ticketLink}
        setTicketLink={setTicketLink}
      />
      <footer className="bg-body-tertiary">
        <div className="text-center p-3 bg-dark-subtle">
          © 2020 Copyright:
          <a className="text-reset fw-bold" href="https://motiurrafi.info/">
            mr.com
          </a>
          <button
            className="btn btn-success mx-5"
            data-bs-toggle="modal"
            data-bs-target="#reportmodal"
          >
            Report
          </button>
        </div>
      </footer>
      <div
        className={`modal fade ${linkState ? "show d-block" : ""}`}
        id="ticketLinkModal"
        tabIndex="-1"
        aria-labelledby="ticketLinkModalLabel"
        aria-hidden="true"
        style={{ position: "fixed", bottom: "10px", left: "10px", width: "250px", zIndex: 1050 }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <a href={ticketLink} target="_blank" rel="noopener noreferrer">
                Your Ticket: {ticketLink}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
