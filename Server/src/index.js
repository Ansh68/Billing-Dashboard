import dotenv from 'dotenv';
import {app} from './app.js';
import { connectPrisma } from './db/prisma.js';

dotenv.config({
    path: ".env"
})

connectPrisma()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    }) 
})
.catch((error) => {
    console.error('Failed to connect to Prisma:', error);
})