import validate from '../libs/validate';

const validateFn = async (inputFile) => {
    try {
        await validate(inputFile);
        console.log(inputFile + ': validation successful')
    } catch (e) {
        console.error(inputFile + ': validation failed')
        console.error(e)
        process.exit(1)
    }
}

module.exports=validateFn
export default validateFn