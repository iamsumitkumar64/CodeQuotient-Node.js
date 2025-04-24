const fs = require('fs');            
const path = require('path');        

const source = './source';          
const destination = './destination'; 
const ext = '.txt';                


fs.readdirSync(source).forEach(file => {

    if (path.extname(file) === ext) {
        fs.copyFileSync(
            path.join(source, file),        
            path.join(destination, file)   
        );
        console.log(`Copied: ${ file }`);   
    }
});