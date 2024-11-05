import React, {useState, useEffect} from "react";
import { Card, Container, Form, InputGroup, Button } from "react-bootstrap";
import profile from '../Components/Images/profile.png';

function Profile(){

    const [user, setUser] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');  // Get the token
                const response = await fetch('http://localhost:5555/users',{
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                      'Content-Type': 'application/json',
                    }}); 

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUser(data[0]);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
    
        fetchUser();
    }, []);

    return(
        <>
        <section>
            <Container style={{textAlign:'center'}} className="p-3">
                <div class="d-lg-flex align-items-center">
                    <img src={profile} alt="UNESWA logo" className="img-fluid"/>
                    <div>
                        <h1 class="pt-lg-5 px-3">Welcome to OnRes!</h1>
                        <h5 class="px-3">Your digital dorm key and accommodation hub.</h5>
                    </div>
                </div>
            </Container>

            <Container style={{textAlign:'center'}} className=" p-5 bg-info">
                <Card>
                        <Card.Header>Student Profile</Card.Header>
                        <Card.Body>
                            <Form>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>Name</InputGroup.Text>
                                    <Form.Control value={`${user.first_name} ${user.last_name}`} readOnly />   
                                </InputGroup>
                                
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>Faculty</InputGroup.Text>
                                    <Form.Control value={user.faculty} />   
                                </InputGroup>

                                <InputGroup className="mb-2">
                                    <InputGroup.Text>Email</InputGroup.Text>
                                    <Form.Control value={user.email} />   
                                </InputGroup>

                                <InputGroup className="mb-2">
                                    <InputGroup.Text>Block</InputGroup.Text>
                                    <Form.Control value={user.dormblock} />   
                                </InputGroup>

                                <InputGroup className="mb-2">
                                    <InputGroup.Text>Room</InputGroup.Text>
                                    <Form.Control value={user.room} />   
                                </InputGroup>
                            </Form>
                        </Card.Body>
                    </Card>
            </Container>
        </section>
        </>
    )
}; export default Profile;