const bcrypt = require('bcrypt');

const plainTextPassword = process.argv[2];

if (!plainTextPassword) {
  console.error('Usage: node src/utils/generateHash.js <password>');
  process.exit(1);
}

bcrypt.hash(plainTextPassword, 10)
  .then((hash) => {
    console.log(hash);
  })
  .catch((error) => {
    console.error('Failed to generate bcrypt hash:', error.message);
    process.exit(1);
  });
