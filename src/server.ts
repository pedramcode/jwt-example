import express from "express"
import User from "./user"
import { IUser, ILoginRequest } from "./interfaces"
import * as jwt from "jsonwebtoken"
const app = express()

app.use(express.json())
const SECRET = "BABAD KOOJAS?"

const database: User[] = []



app.get("/", (req, res)=>{
    res.send("Server is up!")
})



app.post("/register", (req, res) => {
    const data: IUser = req.body
    if(!data.username || !data.password || !data.email){
        res.status(400)
        return res.send({"error":"Send required params"})
    }
    let validUser = true
    for(const item of database){
        if(item.username === data.username || item.email === data.email){
            validUser = false
            break
        }
    }

    if(!validUser){
        res.status(400)
        return res.send({"error":"Username or email already exists"})
    }

    database.push(data)

    res.status(201)
    return res.send({"data": "User is registered!"})

})



app.post("/login", (req, res)=>{
    const data: ILoginRequest = req.body
    if(!data.username || !data.password){
        res.status(400)
        return res.send({"error":"Send required params"})
    }
    let user: User
    database.forEach(item=>{
        if(item.username === data.username && item.password === data.password){
            user = item
        }
    })

    if(!user){
        res.status(403)
        return res.send({"error":"Wrong user credentials!"})
    }

    const token = jwt.sign({
        type: "TOKEN",
        username: user.username,
    }, SECRET)

    const ref_token = jwt.sign({
        type: "REF_TOKEN",
        username: user.username,
    }, SECRET)

    res.status(200)
    return res.send({"token": token, "refresh_token": ref_token})

})



app.get("/refresh", (req, res)=>{
    const data: any = req.body
    if(!data || !data.ref_token){
        res.status(400)
        return res.send({"error":"Send required params"})
    }
    let token_data: any
    try{
        token_data = jwt.verify(data.ref_token, SECRET)
        if(!token_data || token_data.type !== "REF_TOKEN"){
            res.status(400)
            return res.send({"error":"Invalid refresh token"})
        }
    }catch(e){
        res.status(400)
        return res.send({"error":"Invalid refresh token"})
    }

    let user: User
    database.forEach(item=>{
        if(item.username === token_data.username){
            user = item
        }
    })

    if(!user){
        res.status(400)
        return res.send({"error":"Invalid user!"})
    }

    const token = jwt.sign({
        type: "TOKEN",
        username: user.username,
    }, SECRET)

    res.status(200)
    return res.send({"token": token})
})


// Authenticated end-point
app.post("/something", (req, res)=>{
    const headers: any = req.headers
    console.log(headers)
    if("authorization" !in Object.keys(headers)){
        res.status(403)
        return res.send({"error":"Unauthorized request"})
    }
    const token = req.headers.authorization

    let token_data: any
    try{
        token_data = jwt.verify(token, SECRET)
        if(!token_data || token_data.type !== "TOKEN"){
            res.status(403)
            return res.send({"error":"Invalid token"})
        }
    }catch(e){
        res.status(403)
        return res.send({"error":"Invalid token"})
    }


    res.status(200)
    return res.send({"msg": `Dear ${token_data.username} you did something!`})
})



app.listen(8080, ()=>{
    console.log("Server is running!")
})