//anything that should not been seing by any user.

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/studentsdb';

//exports.DATABASE_URL = 'mongodb+srv://test:qwerty123@cluster0-oergi.mongodb.net/studentsdb?retryWrites=true&w=majority' || 'mongodb://localhost/studentsdb';

exports.TOKEN = process.env.TOKEN || 'password123456';

exports.PORT = process.env.PORT || '8080';

//mongodb+srv://test:qwerty123@cluster0-oergi.mongodb.net/studentsdb?retryWrites=true&w=majority;