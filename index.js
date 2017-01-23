#!/usr/bin/env node --harmony

const program = require('commander');
const bcrypt = require('bcrypt');

const readline = require('readline');
const fs = require('fs');

program
    .version('1.0.0')
    .arguments('<password>')
    .option('-s, --salt <salt>', 'Salt round. - Default = 10', parseInt)
    .option('-f, --file <file>', 'File with passwords to be bcrypteds.')
    .action(function (password, salt) {
        _password = password;
    })
    .parse(process.argv);

if (typeof _password !== 'undefined') {

    bcrypt.hash(_password, program.salt)
        .then(function (hash) {
            console.log(hash);
        })
        .catch(function (err) {
            console.error(err);
        });

} else if (program.file) {

    const rl = readline.createInterface({
        input: fs.createReadStream(program.file),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        let chunck = line.split(':');
        let _plainText;

        if (chunck.length > 1) {
            _plainText = chunck[1];
        } else {
            _plainText = chunck[0];
        }

        bcrypt.hash(_plainText, program.salt)
            .then(function (hash) {
                if (chunck.length > 1) {
                    rl.output.write(chunck[0] + ':' + hash + '\n');
                } else {
                    rl.output.write(hash + '\n');
                }
            })
            .catch(function (err) {
                console.error(err);
            });
    });

} else {
    console.error('Hey Sr .... What I have to do ?')
    process.exit(-1);
    return;
}