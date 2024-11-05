import React, {useState} from "react";
import { Card, Container, Form, Button, Col } from "react-bootstrap";
import logo from '../Components/Images/uneswa.png';

const Home =({onLogin}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
      };

    return(
        <>
        <section className="p-3">
            <Container style={{textAlign:'center'}} className="p-3">
                    <Col><img src={logo} alt="UNESWA logo" className="img-fluid w-25"/></Col>
                    <Col>
                        <h1 class="pt-lg-5 px-3">Welcome to OnRes!</h1>
                        <h4 class="px-3">Your digital dorm key and university accommodation hub.</h4>
                    </Col>
            </Container>

            <Container style={{textAlign:'center'}} className="pt-5">
                <Card>
                    <Card.Header>Student Login</Card.Header>
                    <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
                        </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <a href='/register' className="px-3">Register here</a>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Form>
                    </Card.Body>
                </Card>
            </Container>
        </section>
        </>
    )
}; export default Home;