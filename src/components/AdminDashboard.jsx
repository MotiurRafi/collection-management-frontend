import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getAdmins, promoteToAdmin, demoteToUser, adminBlock, adminUnblock, searchUser } from "../api";

export default function AdminDashboard({
    userData,
    setUserData,
    color_theme_toggle,
    colorThemeState,
    handleSearch,
    searchValue,
    setSearchValue,
    searchResult,
}) {
    const [admins, setAdmins] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await getAdmins();
            setAdmins(response.data);
        } catch (error) {
            console.log('Error fetching admins:', error);
        }
    };

    const promoteUser = async (userId) => {
        try {
            const response = await promoteToAdmin(userId);
            console.log(response.data);
            fetchAdmins();
        } catch (error) {
            console.log('Error promoting admin:', error);
        }
    };

    const demoteAdmin = async (userId) => {
        try {
            const response = await demoteToUser(userId);
            console.log(response.data);
            fetchAdmins();
        } catch (error) {
            console.log('Error demoting admin:', error);
        }
    };

    const blockAdmin = async (userId) => {
        try {
            const response = await adminBlock(userId);
            console.log(response.data);
            fetchAdmins();
        } catch (error) {
            console.log('Error blocking admin:', error);
        }
    };

    const unblockAdmin = async (userId) => {
        try {
            const response = await adminUnblock(userId);
            console.log(response.data);
            fetchAdmins();
        } catch (error) {
            console.log('Error unblocking admin:', error);
        }
    };

    const findUsers = async (query) => {
        if (query === '') return;
        try {
            const response = await searchUser(query);
            setSearchedUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.log('Error searching users:', error);
        }
    };

    if (userData && (userData.role !== "admin" || userData.status !== "active")) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <Navbar
                color_theme_toggle={color_theme_toggle}
                colorThemeState={colorThemeState}
                userData={userData}
                setUserData={setUserData}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                handleSearch={handleSearch}
                searchResult={searchResult}
            />

            <div className="container" style={{ minHeight: '100vh' }}>
                <h2 className="text-center mb-5">Admin Dashboard</h2>

                <table className="table mb-5 align-middle mb-0 bg-white">
                    <thead className="bg-light">
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src="/images/admin-logo.png"
                                            alt=""
                                            style={{ width: "45px", height: "45px" }}
                                            className="rounded-circle"
                                        />
                                        <div className="ms-1">
                                            <p className="fw-bold mb-1">{admin.username}</p>
                                            <p className="text-muted mb-0">{admin.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p className="fw-normal mb-1">{admin.role}</p>
                                </td>
                                <td>
                                    <span>{admin.status}</span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-link btn-sm btn-rounded"
                                        onClick={() => demoteAdmin(admin.id)}
                                    >
                                        Demote
                                    </button>
                                    {admin.status === 'active' ? (
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm btn-rounded"
                                            onClick={() => blockAdmin(admin.id)}
                                        >
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm btn-rounded"
                                            onClick={() => unblockAdmin(admin.id)}
                                        >
                                            Unblock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="find_user">
                    <h3 className="text-center mb-4">Search User</h3>
                    <form className="d-flex flex-column align-items-center">
                        <input
                            type="text"
                            onChange={(e) => findUsers(e.target.value)}
                            placeholder="Search users..."
                        />
                        {searchedUsers && searchedUsers.length > 0 && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedUsers.map((user) => (
                                        <tr key={user.id}>
                                            <th scope="row">{user.username}</th>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                {user.role === 'admin' ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm btn-rounded"
                                                        onClick={() => demoteAdmin(user.id)}
                                                    >
                                                        Demote
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm btn-rounded"
                                                        onClick={() => promoteUser(user.id)}
                                                    >
                                                        Promote
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </form>
                </div>
            </div>
            <Footer userData={userData} />
        </div>
    );
}
