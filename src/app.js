const express = require('express')
const { Server } = require('socket.io')
const app = express()
const PORT= process.env.PORT || 8080
const server = app.listen(PORT, ()=>console.log(`Server up on port ${PORT}`))
app.use(express.static('./src/public'))
const fs= require('fs')

const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('views','./src/public/views')
app.set('view engine', 'handlebars')

const io = new Server(server)


let products = []
let messageHistory = []
let file = './messages.txt'


app.get('/', (req, res)=>{
    res.render('products')
})


io.on('connection', socket => {
    
    console.log('Socket')

    //cuando recibo un paquete llamado product, lo pusheo al array de products
    //devuelvo el array en un paquete llamado products
    socket.on('product', data => {
        products.push(data)
        io.emit('products', products)

    })
    //el que se conecta, que reciba los productos existentes
    socket.emit('products', products)

    messageHistory = readExistingMessages(file)

    socket.on('chat', data => {

        console.log(messageHistory)

        messageHistory.push(data)

        io.emit('messageHistory', messageHistory)
        writeMessageFile(messageHistory, file)
    })

    //el que se conecta, recibe todos los chats
    socket.emit('messageHistory', messageHistory) 

})


/* Agregamos el historial de chat a un archivo messages.txt */

const writeMessageFile = (messages, file) => {

    console.log(messages)

    messages = JSON.stringify((messages),null,2)

    try {

        fs.writeFileSync(file, messages)

        console.log({Status: 'Success', messages})

    } catch(err){

        console.log({Status: 'Error', Message: err})

    }
}

const readExistingMessages = (file) => {
    try {

        let messageHistory = []

        if(fs.existsSync(file)){

            messageHistory = JSON.parse(fs.readFileSync(file, 'utf8'))

        } 
        
        return messageHistory

    } catch(err) {
        console.log({Status: 'Error', Message: err})
    }
}



