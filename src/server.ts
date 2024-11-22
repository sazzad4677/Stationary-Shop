import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
(async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Connected to Database Successfully');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
