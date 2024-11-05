import React, {useState, useEffect} from "react";
import {Row, Col, Container, Navbar, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AdminNav({onLogout}) {

    const [user, setUser] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');  // Get the token
                const response = await fetch('http://localhost:5555/current_user',{
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                      'Content-Type': 'application/json',
                    }}); 

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
    
        fetchUser();
    }, []);

  return (
    <>
        <Navbar expand="lg" className="navbar" style={{backgroundColor:"#f0f0f0"}}>
            <Container>
            <Navbar.Brand as={Link} to="/">WEB DORM</Navbar.Brand>

                <Navbar.Collapse id="nav-components">
                    <ul className="navbar-nav ms-auto">
                        <Col>
                            <Row><>
                                <Col>Welcome {user.first_name}</Col>
                                <Col><Button variant='link' onClick={onLogout}>Logout</Button></Col>
                            </></Row>
                            <Row>
                                <ul className="nav-item">
                                    <li className="nav-item px-2"><Link to='/admin/users' className='px-2'>Users</Link> |</li>
                                    <li className="nav-item px-2"><Link to='/admin/tickets' className='px-2'>View Tickets</Link> </li>
                                    <li className="nav-item px-2"><Link to='/admin/user_credits' className='px-2'>User Credits</Link> </li>
                                </ul>
                            </Row>
                        </Col>
                    </ul>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    </>
  );
}

export default AdminNav;