import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavigationBar = () => {
    const[searchTerm, setSearchTerm] = useState('');
    const[includeAdult, setIncludeAdult] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();

    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleIncludeAdultChange = () => {
        setIncludeAdult(!includeAdult);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${searchTerm}&includeAdult=${includeAdult}`);
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">FilmFolio</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <NavDropdown title="Movies" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/movies/popular">Popular Movies</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Form inline onSubmit={handleSearchSubmit}>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" value={searchTerm} onChange={handleSearchChange} />
                    <Form.Check
                        type="checkbox"
                        label="Include Adult"
                        checked={includeAdult}
                        onChange={handleIncludeAdultChange}
                        className="mr-sm-2"
                    />
                    <Button variant="outline-success" type="submit">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;