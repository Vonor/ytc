import validate from '../libs/validate';
import path from 'path';
import {promisify} from 'util';
import fs from 'fs';
import handlebars from 'handlebars';
const fileRead = promisify(fs.readFile);
const fileWrite = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir)

handlebars.registerHelper({
    'toLowerCase': (str) => {
        return str.toLowerCase();
    },
    'toUpperCase': (str) => {
        return str.toUpperCase();
    },
    'parse': (str) => {
        return JSON.parse(str);
    },
    'stringify': (str) => {
        return JSON.stringify(str, null, 2);
    },
    'assignjson': (varname, value, options) => {
        options.data.root[varname] = JSON.parse(value);
    },
    'is': (a, b, opts) => {
        if (a == b) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    },
    'isnot': (a, b, opts) => {
        if (a != b) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    },
    'length': (a) => {
        if (typeof a === 'object') return a.length
        return '#'
    }
});

const convert = async (inputFile) => {
    try {
        const inputData = await validate(inputFile);
        const templateData = await fileRead(path.resolve(process.cwd(), 'templates', inputData.Schema + '.template.hbs'), 'utf8');
        const template = await handlebars.compile(templateData);
        inputData.env = process.env
        const result = await template(inputData)
        const outputextension = inputData.outputextension || '.conf'
        const outfile = path.resolve(inputFile.replace('configs', 'output').replace(path.extname(inputFile), outputextension))
        try {
            await mkdir(path.dirname(outfile), { recursive: true })
            await fileWrite(outfile, result)
            console.log(`${outfile} written`)
        } catch (error) {
            throw error
        }
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports=convert
export default convert