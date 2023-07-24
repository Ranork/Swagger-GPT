import flatten_file from "./flattenfiles.js";
import get_files from "./getfiles.js";
import fs from 'fs'



async function run() {
  let basetext = fs.readFileSync('base.txt').toString()
  let files = get_files()

  console.log('Find files: ' + files.length);

  for (let f of files) {
    let ffile = flatten_file(process.env.target_path + '/' + f)
    
    fs.writeFileSync('docs/' + f , basetext + ffile.join('\r'))
  }

  console.log('Documents ready to use!');
  console.log('Open chat.openai.com and send files in docs/ folder');
}


run()