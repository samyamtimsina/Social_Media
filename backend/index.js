import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import likeRoutes from './routes/like.js';
import followRoutes from './routes/follow.js';
import postRoutes from './routes/post.js';
import profileRoutes from './routes/profile.js';
import userRoutes from './routes/users.js';

dotenv.config();
const app = express();

// app.use(cors());
app.use(
  cors({
    origin: 'https://social-media-tan-gamma.vercel.app/login', // Replace with your frontend URL
    // origin: 'http://192.168.18.254:5173', // Replace with your frontend URL
    credentials: true,
  }),
);
app.use(express.json());
//auth routes
app.use('/api/auth', authRoutes);

//profile routes
app.use('/api/profile', profileRoutes);

//Like routes
app.use('/api', likeRoutes);

//Follow routes
app.use('/api/follow', followRoutes);

//Post routes
app.use('/api/posts', postRoutes);
// app.get('/api/auth/profile', (req, res) => {
//   res.send('Welcome to the backend server!');
// });
//
//Users routes
app.use('/api/users', userRoutes);

//file uplaod
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
