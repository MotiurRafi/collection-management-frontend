import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { salesforceRegister, getToken } from '../api';
import { useNavigate } from "react-router-dom";

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { email, name, phone, accessToken, instanceUrl}
        try {
            const response = await salesforceRegister(data);
            console.log("Successfully created Salesforce Account", response);
            navigate(`/dashboard?id=${userData.id}?salesforce=success`)
        } catch (error) {
            console.log("Error creating Salesforce account:", error);
        }
    };

    return (
        <div>
            <form id="salesforceForm" onSubmit={handleSubmit}>
                <input type="text" name="name" onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="text" onChange={(e) => setPhone(e.target.value)} name="phone" placeholder="Phone Number" />
                <button type="submit">Create Salesforce Account</button>
            </form>
        </div>
    );
}
