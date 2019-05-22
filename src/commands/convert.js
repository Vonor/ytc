import validate from '../libs/validate';
import path from 'path';
import {promisify} from 'util';
import fs from 'fs';
import handlebars from 'handlebars';
const fileRead = promisify(fs.readFile);

handlebars.registerHelper({
    'toLowerCase': function(str) {
        return str.toLowerCase();
    },
    'toUpperCase': function(str) {
        return str.toUpperCase();
    },
    'parse': function(str) {
        return JSON.parse(str);
    },
    'stringify': function(str) {
        return JSON.stringify(str, null, 2);
    },
    'assignjson': function(varname, value, options) {
        options.data.root[varname] = JSON.parse(value);
    }
});

const convert = async (inputFile) => {
    try {
        const inputData = await validate(inputFile);
        const templateData = await fileRead(path.resolve(process.cwd(), 'templates', inputData.Schema + '.template.hbs'), 'utf8');
        const template = await handlebars.compile(templateData);
        inputData.env = process.env
        const result = await template(inputData)
        console.log(result)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports=convert
export default convert