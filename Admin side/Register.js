import { useState } from "react";
import { Card, Container, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../Authentication/API";

function Register(){

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfrimPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [faculty, setFaculty] = useState('')
    const [year, setYear] = useState('')
    const [block, setBlock] = useState('')
    const [room, setRoom] = useState('')
    const [userInfo, setUserInfo] = useState([])
    const navigate = useNavigate();


    const handleRegistration = async (e) => {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        console.log(password)

        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            faculty: faculty,
            year: year,
            block: block,
            room: room
        } 
        console.log(data)

        try {
          const response = await api.post('/users', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
          });
      
          console.log(response)
          alert('Registration complete')
        } catch (error) {
          console.error('Error handling data: ', error)
        }
      };

    return(
        <section className="pt-5">
        <Container style={{textAlign:'center'}} className="pt-5">
                <Card>
                    <Card.Header>Student Registration</Card.Header>
                    <Card.Body>
                    <Form>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>First Name:</InputGroup.Text>
                            <Form.Control as="textarea" value={firstName} onChange={(e) => setFirstName(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Last Name:</InputGroup.Text>
                            <Form.Control as="textarea" value={lastName} onChange={(e) => setLastName(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Email:</InputGroup.Text>
                            <Form.Control as="textarea" value={email} onChange={(e) => setEmail(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Faculty:</InputGroup.Text>
                            <Form.Control as="textarea" value={faculty} onChange={(e) => setFaculty(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Year of Study:</InputGroup.Text>
                            <Form.Control as="textarea" value={year} onChange={(e) => setYear(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Acc Block:</InputGroup.Text>
                            <Form.Control as="textarea" value={block} onChange={(e) => setBlock(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Room:</InputGroup.Text>
                            <Form.Control as="textarea" value={room} onChange={(e) => setRoom(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Password:</InputGroup.Text>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Confirm Password:</InputGroup.Text>
                            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfrimPassword(e.target.value)} required rows={1} />
                        </InputGroup>
                        <Button onClick={handleRegistration}>Submit</Button>
                    </Form>
                    </Card.Body>
                </Card>
            </Container>
    </section>
    )
} export default Register;