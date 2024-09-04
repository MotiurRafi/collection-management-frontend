import React from "react";
import TicketModal from "./TicketModal";

export default function Footer({ userData }) {
  return (
    <div>
      <TicketModal userData={userData} />
      <footer className="bg-body-tertiary">
        <div className="text-center p-3 bg-dark-subtle" >
          © 2020 Copyright:
          <a className="text-reset fw-bold" href="https://motiurrafi.info/">
            mr.com
          </a>
          <button className=" btn btn-primary rounded bg-primary-subtle p-2 btn " data-bs-toggle="modal" data-bs-target="#reportmodal">Report</button>
        </div>
      </footer>
    </div>
  );
}
