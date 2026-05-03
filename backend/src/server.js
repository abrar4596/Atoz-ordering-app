const { app } = require('./index');
const connectDB = require('./config/db');

const port = process.env.PORT || 5454;

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
