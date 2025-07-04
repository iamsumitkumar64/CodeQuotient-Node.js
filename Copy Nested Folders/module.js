const fs = require('fs');
const path = require('path');

function search_in_folder(source, ext, destination) {
    if (!ext) ext = '.'
    fs.mkdir(destination, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating destination folder: ${err}`);
            return;
        }
        const stack = [{ src: source, dest: destination }];
        const timer1 = setInterval(() => {
            if (stack.length) {
                while (stack.length > 0) {
                    const { src, dest } = stack.pop();
                    let items;

                    try {
                        items = fs.readdirSync(src);
                    } catch (err) {
                        console.error(`Error reading directory: ${src}`, err);
                        continue;
                    }

                    const files = [], folders = [];

                    for (const item of items) {
                        const fullPath = path.join(src, item);
                        const stat = fs.statSync(fullPath);
                        if (isMatchingFile(stat, item, ext)) {
                            files.push(item);
                        } else if (stat.isDirectory()) {
                            folders.push(item);
                        }
                    }

                    for (const file of files) {
                        const sourceFile = path.join(src, file);
                        const destFile = path.join(dest, file);
                        copy_func(sourceFile, destFile, file, dest);
                    }

                    for (const folder of folders) {
                        const newSrc = path.join(src, folder);
                        const newDest = path.join(dest, folder);

                        fs.mkdirSync(newDest, { recursive: true });
                        stack.push({ src: newSrc, dest: newDest });
                    }
                }
            } else {
                const timer2 = setInterval(() => {
                    if (!stack.length) clearInterval(timer1);
                    clearInterval(timer2);
                }, 5000);
            }
        }, 1000);
    });
}

function copy_func(sourceFile, destFile, file, dest) {
    fs.copyFile(sourceFile, destFile, (err) => {
        if (err) {
            console.error(`Error copying file ${file}:`, err);
        } else {
            console.log(`Copied '${file}' to '${dest}'`);
        }
    });
}

function isMatchingFile(stat, item, ext) {
    return stat.isFile() && (ext === '.' || item.endsWith(`.${ext}`));
}

module.exports = { search_in_folder };