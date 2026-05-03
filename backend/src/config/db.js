const mongoose = require('mongoose');
const mondbUrl="mongodb+srv://abrar4596khan_db_user:oHJHXzKIymUFJ0XE@cluster0.xlqztq9.mongodb.net/?appName=Cluster0"

const connectDB = async () => {
  try {
    await mongoose.connect(mondbUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;