// date time message req.method req.url req.headers

const { format }  = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path =  require('path');

const logEvent = async (message, logFileName) => {
    const dateTime =  format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}`

    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', logFileName), logItem)
    } catch(err) {
        console.log(err)
    }
}

const logger =  (req, res, next) => {
    logEvent(`${req.url}\t${req.method}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
}

module.exports = { logEvent, logger}