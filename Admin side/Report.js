import React, { useState, useEffect } from "react";
import { Card, Container, InputGroup, Form, Button, Table } from "react-bootstrap";

function Report(){

    const [type, setType] = useState('')
    const [details, setDetails] = useState('')
    const [reports, setReports] = useState([])

    const handleReport = async (e, method='GET') => {
        if (e) {
            e.preventDefault();
        }

        const token = localStorage.getItem('token');  // Get the token

        try{
            let options = {
                method: method,
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${token}`
                },
            };

            if (method === 'POST'){ 
                const data ={
                    type: type,
                    details: details
                }
                options.body = JSON.stringify(data)
                console.log('post request: ', data)
            }

            const response = await fetch('http://localhost:5555/report', options)

            if (!response.ok){
                const errorMessage = await response.text();  // Get error message from server
                console.error('Server error:', errorMessage);
                throw new Error(`Request failed: ${response.status}`);
            }

            if (method === 'POST'){
                setType('')
                setDetails('')
            } else if (method === 'GET'){
                const responseData = await response.json();
                setReports(Array.isArray(responseData) ? responseData : [])
                console.log(responseData)
            }
            

        } catch (error) {
            console.error('Error handling user data:', error)
        }
    }

    useEffect(() => {
        console.log('fetching...')
        handleReport(null, 'GET'); // Automatically fetch user info on component mount
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
                    <Card.Header>Create A Ticket</Card.Header>
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
                        <InputGroup className="mb-3" controlId="formBasicUsername">
                            <InputGroup.Text>Details</InputGroup.Text>
                            <Form.Control type="text" value={details} onChange={(e) => setDetails(e.target.value)} rows={3}/>
                        </InputGroup>
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
                            <th>Issue Type</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>Uploaded</th>
                            <th>Last Actioned</th>
                        </tr>
                    </thead>
                    <tbody>
                    {reports && reports.map((report, index) =>{
                        return (
                          <tr key={index}>
                            <td>{report.id}</td>
                            <td>{report.type}</td>
                            <td>{report.details}</td>
                            <td>{report.status}</td>
                            <td>{formatDate(report.uploaded)}</td>
                            <td>{formatDate(report.last_actioned)}</td>
                          </tr>
                        
                      )})}
                    </tbody>
                </Table>
            </Container>
        </section>
        </>
    )
}; export default Report;