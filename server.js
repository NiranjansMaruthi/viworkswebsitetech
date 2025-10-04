const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();
const PORT = process.env.PORT||3002;


// server for the statsic  frontend Files
app.use(express.static(path.join(__dirname,"Public")));

//Enable CORS for all origin (you can restrict to your domian)
app.use(cors({
    origin:"https://viworkstech.onrender.com", //Forntend domian
methods:["GET","POST","OPTIONS"],
allowedHeaders:["Content-Type"],
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




//Proxy route
app.post("/api/submit",async(req,res)=>{
    try{
        const scriptUrl="https://script.google.com/macros/s/AKfycbxM7R8Ux1JxK2sCWzBJqv1Lb8SUp0FnD9xdnSldN3gNkuUGA0Iq2bRnHiUUJvyQoefmRg/exec"; //App script link 
        const response = await fetch(scriptUrl, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(req.body),
        });

        // Allow the access for the website to fetch data 
        const text = await response.text();
        res.setHeader("Access-Control-Allow-Origin","https://viworkstech.onrender.com");
        res.send(text);

        
    } catch(error){
        console.error("Proxy Error:", error);
        res.status(500).json({status:"erroe", message:error.message});
    }
    });

app.listen(PORT,()=>{
    console.log(`Proxy server running at http://localhost:${PORT}`)
});