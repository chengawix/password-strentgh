const {classifyPassword} = require("./password-strentgh");
const [image, script, username, ...password] = process.argv;

var _password = password.join(" ");

if (!username||!password||!password.length) {
    console.log(`Usage: ${script} username password`)
    process.exit()
}

try {
    if (_password===username) throw new Error("Do not use your username as password");
    console.log(classifyPassword(_password,username))
} catch (error) {
    console.log(error.message)
}