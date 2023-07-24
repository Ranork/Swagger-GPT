import fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

export default function get_files() {
  let files = fs.readdirSync(process.env.target_path).filter(f => (f.endsWith(process.env.file_suffix)))
  return files
}
