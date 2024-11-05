import { useState, useEffect } from "react";
import { Container, Card, Form, InputGroup, Button, Table } from "react-bootstrap";

function UserCredits(){

    const [userID, setUserID] = useState('')
    const [newCredit, setNewCredit] = useState()
    const [newOverdraft, setNewOverdraft] =useState()
    const [modifyCredit, setModifyCredit] = useState(false)
    const [users, setUsers] = useState([])
    const [creditInfo, setCreditInfo] = useState([])
    const [selected, setSelected] = useState(false)

    const handleReset = () =>{
        // setUsername('')
        setCreditInfo([])
    }

    function toggleSelected(){
        setSelected(!selected)
    } 

    const handleUserChange = (id) => {
        setUserID(id);
        console.log("Selected Group ID:", id);
      };

    function checkFields(){
        if(newCredit && newOverdraft && userID){
            handleUpdate(null, 'POST')
        }else {
            alert('Please fill in all fields')
        }
    }

    const handleUpdate = async (e, method='POST') => {
        if (e) {
          e.preventDefault();
        }
        const token = localStorage.getItem('token');
  
      // Prepare data to send
      const data = {
        newCredit: newCredit,
        newOverdraft: newOverdraft
      };
      console.log('data prepped')
  
      let options = {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
        credentials: 'include',
      };
  
      try {
  
            if (method === 'POST'){
              options.body = JSON.stringify(data)
            }
          const response = await fetch(`http://localhost:5555/credit?userID=${userID}`, options);
  
        // Handle successful response
          if (response.ok) {
              const responseData = await response.json();
              if (method === 'POST'){
                    setNewCredit('');
                    setNewOverdraft('');
                    handleUpdate(null, 'GET');
                    setModifyCredit(!modifyCredit)
                } else if (method==='GET'){
                    setCreditInfo(responseData)
                }
        }
      } catch (error) {
        // Handle errors
        console.error('Error submitting data:', error);
      }
        };  

    useEffect(() => {
        const fetchData = async () => {
          const token = localStorage.getItem('token');  // Get the token
          
            try {
                const response = await fetch('http://127.0.0.1:5555/users', {
                  method: 'GET',
                  headers: { 
                      'Content-Type': 'application/json' ,
                      'Authorization': `Bearer ${token}`
                  },
                });
                if (!response.ok) {
                  throw new Error(`Error fetching user info: ${response.status}`);
                }
                const data = await response.json();
                if (data){
                    setUsers(data);
                }
                console.log(users)
              } catch (error) {
                console.error('Error fetching carriers:', error);
              }
            };
        
        fetchData();
    }, []);

    useEffect(() => {
        if (userID){
            handleUpdate(null, 'GET')
        }
    }, [userID]);

    return(
        <section>
            <Container style={{textAlign:'center'}} className=" p-5 bg-info">
            <Card className="mb-5">  {/*Manage User*/}
                    <Card.Header>Manage Users</Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-2">   {/* Groups */}
                            <InputGroup>
                                <InputGroup.Text>User List</InputGroup.Text>
                                <Form.Select aria-label="User List" value={userID} onChange={(e) => handleUserChange(e.target.value)} onClick={toggleSelected}>
                                    <option key={0} value={0}>- Select -</option>
                                    {users && users.map((user, index) =>{
                                    return (
                                        <option key={index} value={user.id}>{`${user.first_name} ${user.last_name}`}</option>
                                    )
                                    })}
                                </Form.Select>
                            </InputGroup>
                        </Form.Group>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Credit Adjustment:</InputGroup.Text>
                            <Form.Control as="textarea" value={newCredit} onChange={(e) => setNewCredit(e.target.value)} required rows={1} />
                        </InputGroup>
                        <InputGroup className="mb-2">
                            <InputGroup.Text>Overdraft Adjustment:</InputGroup.Text>
                            <Form.Control as="textarea" value={newOverdraft} onChange={(e) => setNewOverdraft(e.target.value)} required rows={1} />
                        </InputGroup>
                        <Button className="me-2"  onClick={checkFields}>Make Adjustment</Button>
                        <Button className="me-2" onClick={handleReset}>Reset</Button>
                    </Card.Body>
                </Card>

                <Table> {/* Results Table */}
                    <thead style={{alignContent:'center'}}>
                        <tr>
                            <th>Email</th>
                            <th>Current Balance</th>
                            <th>Previous Balance</th>
                            <th>Credit Adjustment</th>
                            <th>Outstanding Overdraft</th>
                            <th>Previous Overdraft</th>
                            <th>Overdraft Adjustment</th>
                            <th>Date Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                    {creditInfo && creditInfo.map((credit) =>{
                      return (
                          <tr key={credit.id}>
                            <td>{credit.email}</td>
                            <td>{credit.curr_credit}</td>
                            <td>{credit.prev_credit}</td>
                            <td>{credit.credit_adj}</td>
                            <td>{credit.curr_overdraft}</td>
                            <td>{credit.prev_overdraft}</td>
                            <td>{credit.overdraft_adj}</td>
                            <td>{credit.last_updated}</td>
                          </tr>
                        
                      )

                      })}
                    </tbody>
                </Table>

            </Container>
        </section>
    )
} export default UserCredits;
