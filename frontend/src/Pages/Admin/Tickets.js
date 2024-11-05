import React, { useState, useEffect } from "react";
import { Card, Container, InputGroup, Form, Button, Table, Row, Col, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function Tickets(){

    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [reports, setReports] = useState([])
    const [ticketID, setTicketId] = useState('')
    const [update, setUpdate] = useState(false)

    const handleReport = async (e, method='POST') => {
        if (e) {
            e.preventDefault();
        }

        const token = localStorage.getItem('token');  // Get the token
        const url = method === 'PUT' ? `http://localhost:5555/report?ticket_id=${ticketID}` : 'http://localhost:5555/report';

        try{
            let options = {
                method: method,
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${token}`
                },
            };

            if (method === 'POST') {
                const data = {
                    type: type,
                    status: status,
                    startDate: startDate,
                    endDate: endDate
                };
                options.body = JSON.stringify(data);
                console.log('POST request:', data);
            } else if (method === 'PUT') {
                const data = { status: status };
                options.body = JSON.stringify(data);
                console.log('PUT request:', data);
            }

            const response = await fetch(url, options);

            if (!response.ok){
                const errorMessage = await response.text();  // Get error message from server
                console.error('Server error:', errorMessage);
                throw new Error(`Request failed: ${response.status}`);
            }
            
            const responseData = await response.json();
            setReports(Array.isArray(responseData) ? responseData : [])
            console.log(responseData)
            handleModalClose();
            await handleReport(null, 'GET');

        } catch (error) {
            console.error('Error handling user data:', error)
        }
    }

    const handleTicketID = (id) => {
        setTicketId(id);
        console.log("Selected ticket ID:", id);
        setUpdate(true)
    };

    
    const handleModalClose = () => {
        setUpdate(false);
        setTicketId(null); 
        setStatus(''); 
    };

    useEffect(() => {
        console.log('fetching...')
        handleReport(null, 'GET'); // Automatically fetch ticket info on component mount
      }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).replace(',', ''); 
      }

    return(
        <>
        <section className="p-5">
            <Container className="p-5" style={{textAlign:'center'}}>
                <Card>
                    <Card.Header>Searching A Ticket</Card.Header>
                    <Card.Body>
                    <Form>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Issue Type</InputGroup.Text>
                            <Form.Select aria-label="Select issue type" value={type} onChange={(e) => setType(e.target.value)}>
                                <option>- Select -</option>
                                <option value="electrical">Electrical</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="furniture">Furniture</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Status</InputGroup.Text>
                            <Form.Select aria-label="Select issue type" onChange={(e) => setStatus(e.target.value)}>
                                <option>- Select -</option>
                                <option value="submitted">Submitted</option>
                                <option value="progress">In Progress</option>
                                <option value="complete">Complete</option>
                            </Form.Select>
                        </InputGroup>
                        <Row>
                            <Col>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>From:</InputGroup.Text>
                                    <Form.Control type="date" className="me-3" value={startDate} onChange={(e)=> setStartDate(e.target.value)}/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>To:</InputGroup.Text>
                                    <Form.Control type="date" className="me-3" value={endDate} onChange={(e)=> setEndDate(e.target.value)}/>
                                </InputGroup>
                            </Col>
                        </Row>
                        <Button onClick={(e) => handleReport(e, 'POST')}>Submit</Button>
                    </Form>
                    </Card.Body>
                </Card>
            </Container>
        </section>
        
        <section className="p-3">
            <Container className="p-5" style={{textAlign:'center'}}>
                <Table>
                    <thead>
                        <tr>
                            <th>Ticket No.</th>
                            <th>Location</th>
                            <th>Issue Type</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>Uploaded</th>
                            <th>Last Actioned</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {reports && reports.map((report, index) =>{
                        return (
                          <tr key={index}>
                            <td>{report.ticket.id}</td>
                            <td>{`${report.dorm_block} ${report.room}`}</td>
                            <td>{report.ticket.type}</td>
                            <td>{report.ticket.details}</td>
                            <td>{report.ticket.status}</td>
                            <td>{formatDate(report.ticket.uploaded)}</td>
                            <td>{formatDate(report.ticket.last_actioned)}</td>
                            <td><Link onClick={()=>handleTicketID(report.ticket.id)}>Update</Link></td>
                          </tr>
                        
                      )})}
                    </tbody>
                </Table>
            </Container>
        </section>

        <Modal size="sm" show={update} onHide={handleModalClose}>
            <Modal.Header closeButton><Modal.Title>Update Status</Modal.Title></Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-2">
                    <InputGroup.Text>Status</InputGroup.Text>
                    <Form.Select aria-label="Select issue type" onChange={(e) => setStatus(e.target.value)}>
                            <option>- Select -</option>
                            <option value="submitted">Submitted</option>
                            <option value="progress">In Progress</option>
                            <option value="complete">Complete</option>
                    </Form.Select>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer><Button onClick={(e)=> handleReport(e, 'PUT')}>Update</Button></Modal.Footer>
        </Modal>

        </>
    )
}; export default Tickets;