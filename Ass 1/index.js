const args = process.argv.slice(2);
// process ===>gives deatils within object
// process.argv ===>gives detaisl within array of 2  upto N
    // 1=>node.js path where to execute
    // 2=>file path what to excute
    // 3,4,..n=>N arguments to be given
console.log(process.argv);
console.log(args);

const fs = require("fs");

if (args.length !== 2) {
    console.log("Please provide exactly two numbers.");
    process.exit(1);
}

const num1 = parseFloat(args[0]);
const num2 = parseFloat(args[1]);

let data = `
Addition : ${num1} + ${num2} => ${num1 + num2}
Subtraction : ${num1} - ${num2} => ${num1 - num2}
Multiplication : ${num1} * ${num2} => ${num1 * num2}
Division : ${num1} / ${num2} => ${num1 / num2}
`;

fs.appendFileSync('output.txt',data);