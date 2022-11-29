const socket = io()

let product = []

let productForm = document.getElementById('form')

const onProductSubmit = (e, form) => {

    e.preventDefault()

    let formData = new FormData(form)

    let obj = {}

    formData.forEach((value, key) => obj[key]= value)

    if (obj.name && obj.price && obj.img) {

        socket.emit('product', obj)
        document.getElementById('faltantes').innerHTML= ``
        

    } else {

        document.getElementById('faltantes').innerHTML= `<p style="text-align:center; margin-top:30px; color:beige; background-color: brown" >Error al insertar producto, falta algún dato mandatorio</p>`

    }

    
}
 
productForm.addEventListener('submit', (e) => {

    onProductSubmit(e, e.target)
})



socket.on('products', data => {

    let tabla = tablaProductos(data)
    let history = document.getElementById('historial')
    history.innerHTML = tabla

})

const tablaProductos = (products) =>{
    let toRender = ""
    let toRender1 = ""
    let toRender2 = ""
    let toRender3 = ""

    if(products.length>0){
        
        toRender1=
        `
        <div style='text-align:center;'>
            <table style="text-align:center; margin-left:0px; margin-right:0px; margin-top:40px" width='100%' cellspacing='0', cellpadding='0', border='0', bgcolor='#F2F2F2'>
                <tr>
                    <th style="width:33%; color:blue">Nombre</th>
                    <th style="width:33%; color:blue">Precio</th>
                    <th style="width:33%; color:blue">Imagen</th>
                </tr>
        `
       products.forEach((item)=>{
        toRender2 +=
        `
                <tr>
                    <td><p style="text-align:center; font-weight:bold">${item.name}</p></td>
                    <td><p style="text-align:center; font-weight:bold">$${item.price}</p></td>
                    <td><p style="text-align:center; font-weight:bold"><img src="${item.img}" alt="${item.img}" style='width:40%'></p></td>
                </tr>
        `
        })

       toRender3=
       `  
            </table>
        </div>
        `

        toRender = toRender1 + toRender2 + toRender3
    }
    else toRender = `<p style="text-align:center; margin-top:30px; color:beige; background-color:blue"  >No hay productos para mostrar</p>`

    return toRender
}


let chatBox = document.getElementById('chatBox')
let chatEmail = document.getElementById('email')

const onMessageSubmit = (e) => {

    e.preventDefault()

    let message = e.target[0].value
    let email = chatEmail.value

    if (message && email) {

        let currentDate = new Date().toLocaleString()

        let chat = {email, message, currentDate} 

        socket.emit('chat', chat)

        document.getElementById('faltantesChat').innerHTML = ``
    }
    else {
    document.getElementById('faltantesChat').innerHTML = `<p style="text-align:center; margin-top:30px; color:beige; background-color: brown" >El mensaje no pudo ser enviado, hay campos sin completar</p>`
    }
   
}
chatBox.addEventListener('submit', (e) => onMessageSubmit(e))

//MOSTRAR EL CHAT

let history2 = document.getElementById('history')


socket.on('messageHistory', data => {


    let messages = ''

    data.forEach(msg => {
        messages += `<p style='text-align:center;'><span style='color:blue; font-weight:bold'>${msg.email}</span> 
        <span style='color: brown'>[${msg.currentDate}]</span>
        <span style='color: green; font-style: italic'>: ${msg.message}</span> `
    })

    history2.innerHTML = messages

    socket.emit('messagesString', messages)

   
})

