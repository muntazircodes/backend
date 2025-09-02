# Backend Setup Instructions

## Environment Configuration

1. Create a `.env` file in the backend directory:
```bash
echo PORT=3000 > .env
echo DATABASE_URI=mongodb://localhost:27017/your_database >> .env
```

## Starting the Application

1. Make sure all dependencies are installed:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Important Notes
- Ensure MongoDB is running locally if using local database
- Default port is 3000, can be changed in `.env`
- Check package.json for additional scripts

## Environment Variables
```
PORT=3000
DATABASE_URI=mongodb://localhost:27017/your_database
```
