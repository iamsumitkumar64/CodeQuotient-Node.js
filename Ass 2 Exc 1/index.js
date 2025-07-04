const { rand } = require("./rand_module")
const fs = require("fs");
const args = process.argv.slice(2);
const num1 = parseFloat(args[0]);
const num2 = parseFloat(args[1]);
let value;
if (num1 && num2) {
    value = rand(num1, num2);
} else {
    console.log("error");
}
fs.appendFileSync('output.txt', `${value}\n`);
