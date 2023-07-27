import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv'

dotenv.config()


export default function flatten_file(filepath) {
  let file_str = fs.readFileSync(filepath).toString()
  
  let nfile_str = []
  let imp_str = []
  let bypass = false

  let filename = filepath.split('/')[filepath.split('/').length - 1]
  if (filename.includes('\\')) filename = filepath.split('\\')[filepath.split('\\').length - 1]

  if (process.env.skip_files.split('|').includes(filename)) return []

  nfile_str.push('\r//@---- File: ' + filename + '\r')

  for (let line of file_str.split('\r')) {
    line = line.replaceAll('//*', '//')
    if (line.includes('/*')) bypass = true

    if (!bypass) {

      let nline = line.replaceAll('\n', '')
      if (nline.length === 0 || nline.includes('dotenv.config()')) continue
      if (nline.startsWith('import')) {
        imp_str.push(nline)
      }
      else {
        nfile_str.push(nline)
      }
    }

    if (line.includes('*/')) bypass = false 
  }
  
  for (let imp of imp_str) {
    let i_part = imp.split(' ')
    let path_index = i_part.findIndex((e) => (e === 'from')) + 1
    
    let inner_path = i_part[path_index].replaceAll('"', '').replaceAll("'", '').replaceAll(';', '')
    if (!inner_path.includes('.js')) continue

    let import_path = path.join(process.env.target_path + '/', inner_path)

    try {
      let i_filename = import_path.split('/')[import_path.split('/').length - 1]
      if (i_filename.includes('\\')) i_filename = import_path.split('\\')[import_path.split('\\').length - 1]
      if (process.env.skip_files.split('|').includes(i_filename)) continue

      var ifile_str = flatten_file(import_path)
    }
    catch (e) {
      console.error(
        e.message + '\n' +
        'Parent File: ' + filename + '\n' +
        'Inner Path: ' + inner_path + '\n' +
        'Import Path: ' + import_path + '\n'
      );
      continue
    }
    nfile_str = [...nfile_str, ...ifile_str]
  }

  return nfile_str
}

