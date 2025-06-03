const fs = require('fs');
const path = require('path');

function search_in_folder(source, ext, destination) {
    fs.mkdir(destination, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating directory: ${err}`);
            return;
        }
        let file_arr = [], folder_arr = [];
        fs.readdirSync(source).forEach(item => {
            const fullPath = path.join(source, item);
            if (fs.statSync(fullPath).isFile() && item.endsWith(`.${ext}`)) {
                file_arr.push(item);
            } else if (fs.statSync(fullPath).isDirectory()) {
                folder_arr.push(item);
            }
        });

        console.log('Files in source:', file_arr);
        console.log('Folders in source:', folder_arr);

        if (file_arr.length) {
            recursive_creation(source, destination, file_arr);
        }

        folder_arr.forEach(folder => {
            const folderPath = path.join(source, folder);
            console.log('FOlderPAth', folderPath);
            let folderFiles = [];

            fs.readdirSync(folderPath).forEach(item => {
                const fullPath = path.join(folderPath, item);
                if (fs.statSync(fullPath).isFile() && item.endsWith(`.${ext}`)) {
                    folderFiles.push(item);
                }
            });
            if (folderFiles.length) {
                const destFolder = path.join(destination, folder);
                fs.mkdirSync(destFolder, { recursive: true });
                recursive_creation(folderPath, destFolder, folderFiles);
            }
        });
    });
}

function find_folder() { }

function recursive_creation(source, destination, set) {
    set.forEach((item) => {
        copy_file(source, destination, item);
    });
}

function copy_file(source, destination, item) {
    const sourceFile = path.join(source, item);
    const destFile = path.join(destination, item);

    fs.copyFile(sourceFile, destFile, (err) => {
        if (err) {
            console.error('Error creating the file:', err);
        } else {
            console.log(`File '${item}' has been copied successfully`);
        }
    });
}

module.exports = { search_in_folder };