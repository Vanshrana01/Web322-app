const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    email: String,
    loginHistory: [
        {
            dateTime: Date,
            userAgent: String
        }
    ]
});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://Vrana:V%40nsh123@senecaweb.pvvnhdv.mongodb.net/?retryWrites=true&w=majority");

        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
            return;
        }

        let newUser = new User(userData);
        newUser.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    reject("User Name already taken");
                } else {
                    reject(`There was an error creating the user: ${err}`);
                }
            } else {
                resolve();
            }
        });
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName }, function (err, users) {
            if (err) {
                reject(`Unable to find user: ${userData.userName}`);
            } else {
                if (users.length === 0) {
                    reject(`Unable to find user: ${userData.userName}`);
                } else {
                    if (users[0].password !== userData.password) {
                        reject(`Incorrect Password for user: ${userData.userName}`);
                    } else {
                        users[0].loginHistory.push({
                            dateTime: new Date().toString(),
                            userAgent: userData.userAgent
                        });

                        User.updateOne(
                            { userName: users[0].userName },
                            { $set: { loginHistory: users[0].loginHistory } },
                            function (err) {
                                if (err) {
                                    reject(`There was an error verifying the user: ${err}`);
                                } else {
                                    resolve(users[0]);
                                }
                            }
                        );
                    }
                }
            }
        });
    });
};