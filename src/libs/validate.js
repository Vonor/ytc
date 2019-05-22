import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import yaml from 'js-yaml';
import mapTypes from 'mapTypes';
import isvalid from 'isvalid';

const fileRead = promisify(fs.readFile)

const validate = async (inputFile) => {
    try {
        const inputData = yaml.safeLoad(await fileRead(inputFile, 'utf8'));
        const schemaFile = await fileRead(path.resolve(process.cwd(), 'schemas', inputData.Schema + '.schema.yml'), 'utf8');
        const schemaData = yaml.safeLoad(schemaFile);
        let schema = mapTypes(schemaData, 'type');
        schema = mapTypes(schema, 'match', {regex: true});
        const valid = await isvalid(inputData, schema)
        const result = JSON.parse(JSON.stringify(valid));
        return result;
    } catch (error) {
        console.log('error:',error)
        throw new Error(error)
    }
}

module.exports=validate
export default validate