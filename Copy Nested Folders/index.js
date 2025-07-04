const {search_in_folder}=require('./module');

const arg = process.argv.slice(2);
const f_cmd_name = arg[0];
const ext = arg[1];

search_in_folder(f_cmd_name,ext,'Destination',[]);