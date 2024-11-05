import React, {useState, useEffect} from "react";
import { Table, Container} from "react-bootstrap";

function Users(){

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
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
    
        fetchUser();
    }, []);

    return(
        <>
        <section>
            <Container style={{textAlign:'center'}} className=" p-5 bg-info">
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Faculty</th>
                            <th>Accommodation</th>
                            <th>Current Credit</th>
                            <th>Current Overdraft</th>
                        </tr>
                    </thead>
                    <tbody>
                    {user && user.map((user, index) =>{
                        const latestCredit = user.credit.at(-1)
                        return (
                          <tr key={index}>
                            <td>{`${user.first_name} ${user.last_name}`}</td>
                            <td>{user.email}</td>
                            <td>{user.faculty}</td>
                            <td>{`${user.dorm_block} ${user.room}`}</td>
                            <td>{latestCredit.curr_credit}</td>
                            <td>{latestCredit.curr_overdraft}</td>
                          </tr>
                        
                      )})}
                    </tbody>
                </Table>
            </Container>
        </section>
        </>
    )
}; export default Users;