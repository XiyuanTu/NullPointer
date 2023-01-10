import fs from 'fs'
import { join } from 'path'

export const getMdText = () => {
    const path = join(process.cwd(), 'home_page.md')
    return fs.readFileSync(path, 'utf8')
}