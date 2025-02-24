# Real-Time Code Editor


## Introduction

The **Real-Time Code Editor** is a collaborative coding platform that enables multiple users to write, edit, and execute code together in real time. Built using the **MERN (MongoDB, Express.js, React, Node.js) stack** and powered by **Socket.IO** for real-time communication, this project enhances teamwork and coding efficiency for developers.

## Youtube Video
**Demo Video:** [Watch on YouTube](https://www.youtube.com/watch?v=o4RimBKXyoY)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

✅ **Real-Time Collaboration:** Multiple users can work on the same code simultaneously.  
✅ **Syntax Highlighting:** Provides a clean and readable coding experience.  
✅ **Session Management:** Users can create and join sessions using unique room IDs.  
✅ **User-Friendly Interface:** Simple and responsive design for seamless usage.

## Project Structure

realtime-code-editor/
├── client/        # Frontend (React.js)
├── server/        # Backend (Node.js, Express)
├── public/        # Static assets
├── package.json   # Project dependencies
└── README.md      # Project documentation


## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager, included with Node.js)
- [MongoDB](https://www.mongodb.com/) (For storing session data)

### Installation

1. **Clone the repository:**

    
sh
    git clone https://github.com/SkyRex06/RealTime_Compiler.git
    cd realtime-code-editor


2. **Install dependencies:**

    
sh
    npm install


### Running the Application

1. **Start the backend server:**

    
sh
    cd server
    npm start


2. **Start the frontend application:**

    
sh
    cd client
    npm start


3. Open your browser and navigate to http://localhost:3000 to start coding collaboratively.

## Usage

1. **Create a New Session:** Click on "Create Room" to generate a unique session ID.
2. **Join an Existing Session:** Enter a valid room ID to join an ongoing session.
3. **Start Coding:** Collaborate with other users in real time.

## Technologies Used

- **Frontend:** React.js, CodeMirror
- **Backend:** Node.js, Express.js
- **Real-Time Communication:** Socket.IO
- **Database:** MongoDB

## Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**.
2. **Create a new branch:**

    
sh
    git checkout -b feature-name


3. **Make your changes** and commit:

    
sh
    git commit -m 'Add some feature'


4. **Push to the branch:**

    
sh
    git push origin feature-name


5. **Open a pull request.**


