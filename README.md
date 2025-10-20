# ElbiTutors

A full-stack MERN (MongoDB, Express, React, Node.js) web application following RESTful API principles for managing items with CRUD operations.

## Features

- **RESTful API**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **MongoDB Database**: NoSQL database for data persistence
- **Express Backend**: Node.js web application framework
- **React Frontend**: Modern UI with component-based architecture
- **CRUD Operations**: Create, Read, Update, and Delete items
- **Responsive Design**: Mobile-friendly user interface

## Project Structure

```
ElbiTutor/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── controllers/    # Request handlers
│   ├── server.js           # Express server entry point
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── services/       # API service layer
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/GabDiocadiz/ElbiTutor.git
cd ElbiTutor
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elbitutor
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel
```

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

The React app will run on `http://localhost:3000`

## API Endpoints

All endpoints are prefixed with `/api/items`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| GET | `/api/items/:id` | Get item by ID |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

### Sample Request Body (POST/PUT)

```json
{
  "name": "Sample Item",
  "description": "This is a sample item description",
  "price": 29.99,
  "category": "Electronics",
  "inStock": true
}
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Add New Item" to create a new item
3. Fill in the form with item details
4. View all items in the grid layout
5. Edit or delete items using the action buttons

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React**: UI library
- **Axios**: HTTP client for API calls
- **CSS3**: Styling

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses Node's --watch flag for auto-restart
```

### Frontend Development

```bash
cd frontend
npm start  # Starts development server with hot reload
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
