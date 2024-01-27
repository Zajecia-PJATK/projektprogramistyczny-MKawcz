import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import "../styles/components/_user_list.scss"
import withAuth from "./withAuth";
import Loader from "./Loader";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.userId;
                    setLoggedInUserId(userId);
                    setIsAdmin(decodedToken.role.toString() === 'ROLE_ADMIN');

                    if(!isAdmin) {
                        setError("You do not have access to this page");
                        return;
                    }

                    const response = await fetch(`http://localhost:8080/api/admin/users`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }

                    const data = await response.json();
                    setUsers(data);
                    setError('');
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            }
        }

        fetchUsers();
    }, []);

    const handleChangeRole = async (userId, newRole) => {
        try {
            if (userId === loggedInUserId) {
                alert("You can not change privileges of your own account.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("No access.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}?newRole=${newRole}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user privileges');
            }

            const updatedUsers = users.map(user =>
                user.idUser === userId ? { ...user, role: newRole } : user
            );
            setUsers(updatedUsers);
            setError('');
            alert('User role changed successfully');
        } catch (err) {
            setError(err.message);
        }
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="users-list-container">
            <div className="page-title">
                <h1>User List</h1>
            </div>
            <div className="users-container">
                {error && <div className="error">{error}</div>}
                {users.map(user => (
                    <div key={user.idUser} className="user-item">
                        <div>
                            {user.idUser !== loggedInUserId && (
                                user.role === 'ROLE_USER' ? (
                                    <button className="button"
                                            onClick={() => handleChangeRole(user.idUser, 'ROLE_ADMIN')}>Change role to
                                        ADMIN</button>
                                ) : (
                                    <button className="button"
                                            onClick={() => handleChangeRole(user.idUser, 'ROLE_USER')}>Change role to
                                        USER</button>
                                )
                            )}
                        </div>
                        <div className="user-data">
                            {user.username} ({user.role.slice(5)})
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default withAuth(UserList);