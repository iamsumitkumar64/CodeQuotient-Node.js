const bcrypt = require('bcrypt');
const saltRound = 10;
const firstpass = 'Hello@12';
const secondpass = 'He1lo@12';

// Salting ensures that even if two users have the same password, their hashes will be different.
// Key stretching makes brute-force attacks more difficult by making the hashing process computationally expensive
// bcrypt.compare() is used to verify a password without revealing the stored hash.
// saltRounds can be adjusted for better security but will also affect performance.

bcrypt.hash(firstpass, saltRound, (err, hashpass) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(hashpass);
    }
    bcrypt.compare(secondpass, hashpass, (err, ismatched) => {
        if (err) {
            console.log(err);
        }
        else {
            if (ismatched) {
                console.log(ismatched, 'Same Password or Correct Password');
            }
            else {
                console.log(ismatched, 'Wrong Password');
            }
        }
    });
});