import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { salesforceRegister, getToken } from '../api';

export default function SalesforceRegister({ userData }) {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [accessToken, setAccessToken] = useState('');
  const [instanceUrl, setInstanceUrl] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await getToken(code);
        setAccessToken(response.data.accessToken);
        setInstanceUrl(response.data.instanceUrl);
        sessionStorage.setItem('accessToken', response.data.accessToken);
        sessionStorage.setItem('instanceUrl', response.data.instanceUrl);
      } catch (error) {
        console.error('Error fetching Salesforce token and instance URL:', error);
      }
    };

    if (code) {
      fetchToken();
    }
  }, [code]);
  useEffect(() => {
    if (userData) {
      setEmail(userData.email)
    }
  }, [userData])
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { email, name, phone, accessToken, instanceUrl };
    try {
      await salesforceRegister(data);
      navigate(`/dashboard?id=${userData.id}&salesforce=success`);
    } catch (error) {
      console.error("Error creating Salesforce account:", error);
    }
  };

  return (
    <div className="container mt-4">
      <form id="salesforceForm" onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <div className="invalid-feedback">
            Please enter a valid name.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            placeholder="Email"
            required
          />
          <div className="invalid-feedback">
            Please enter a valid email.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <button type="submit" className="btn btn-primary">Create Salesforce Account</button>
      </form>
    </div>

  );
}