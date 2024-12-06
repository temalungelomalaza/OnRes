# OnRes Web App
This system is a protoype of an online portal for the management of on-campus accommodation for full-time students. 
The system stores registered students' accommodation data including their assigned rooms, related debit and credit records and complaints about the assigned room, in order to achieve seamless and easier management on students living on-campus and tracking all the accommodation services.

## STURCTURE OF SYSTEM
The system has 2 sub structures: frontend & backend
## Frontend
OnRes will include the following web pages and functionalities
1. Home Page/Landing Page
   - has login / register popups
   - provides brief description of the system as well as some images of the university dorms
   
2. User Profile
   - displays inofrmation of student ; full name, student ID, Year of study, gender and credit balances
     
3. Make A Report
   - consists of a form for lodging any complaints related to their accommodation
  
     ## Backend
The backend of the system runs on Flask, an open source API, and SQL lite, which serves as a relational database management system. 
Flask allows the querying of the databse using Python, suitably connecting requests and responses between the user interface and database.

# Steps to run the system:

1. Change directory to 'backend' and run the commands type {one by one}:
   
    cd backend

    flask db migrate

    flask db upgrade
   
This will ensure all the migrations to the database are up to date. 

2. Run the app.py file, type:

   python app.py
   
3. Change directories to 'frontend'
   
   cd frontend
   
4. Latly,start the webapp using the following command:
   
        npm start

The webapp should run!
