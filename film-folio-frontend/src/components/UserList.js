import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Brak dostępu.");
                    return;
                }

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                setLoggedInUserId(userId);

                const response = await fetch(`http://localhost:8080/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Nie udało się pobrać listy użytkowników');
                }

                const data = await response.json();
                setUsers(data);

            } catch (err) {
                setError(err.message);
            }
        }

        fetchUsers();
    }, []);

    const handleChangeRole = async (userId, newRole) => {
        try {
            if (userId === loggedInUserId) {
                alert("Nie możesz zmienić roli swojego konta.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Brak dostępu.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}?newRole=${newRole}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Nie udało się zmienić uprawnień użytkownika');
            }

            const updatedUsers = users.map(user =>
                user.idUser === userId ? { ...user, role: newRole } : user
            );
            setUsers(updatedUsers);

            alert('Rola użytkownika zmieniona pomyślnie');
        } catch (err) {
            setError(err.message);
        }
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    if (!users) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div>
            <h2>Lista Użytkowników</h2>
            {users.map(user => (
                <div key={user.idUser}>
                    <div>
                        <div>
                            {user.username} - {user.role.slice(5)}
                            {user.idUser !== loggedInUserId && (
                                user.role === 'ROLE_USER' ? (
                                    <button onClick={() => handleChangeRole(user.idUser, 'ROLE_ADMIN')}>Zmień rolę na ADMIN</button>
                                ) : (
                                    <button onClick={() => handleChangeRole(user.idUser, 'ROLE_USER')}>Zmień rolę na USER</button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;