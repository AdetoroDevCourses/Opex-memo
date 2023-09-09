const express = require('express');
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser');
const cors =  require('cors')
const { logger } = require('./middlewares/logger')
const errorhandler = require('./middlewares/errorHandler')




const PORT = process.env.PORT || 5000
app.use(cookieParser);
app.use(cors())
app.use(logger)
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/routes'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({message: "404 Not Found"})
    }else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorhandler)

app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))