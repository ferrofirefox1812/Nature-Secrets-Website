const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


// ================================
// MIDDLEWARE
// ================================

app.use(express.json());


app.use(session({

    secret: "nature-secrets-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }

}));



// ================================
// PROTECT ADMIN PAGE
// ================================

app.get("/admin.html", function(req, res){


    if(req.session.admin){


        res.sendFile(
            __dirname + "/public/admin.html"
        );


    }

    else{


        res.redirect("/admin-login.html");


    }


});



// ================================
// PUBLIC FILES
// ================================

app.use(express.static("public"));




// ================================
// ADMIN LOGIN
// ================================

app.post("/admin-login", function(req,res){


    const password = req.body.password;



    if(password === "Nature123"){


        req.session.admin = true;


        res.json({

            success:true

        });


    }


    else{


        res.json({

            success:false

        });


    }


});




// ================================
// ADMIN LOGOUT
// ================================

app.get("/admin-logout", function(req,res){


    req.session.destroy(function(){


        res.redirect("/admin-login.html");


    });


});





// ================================
// SAVE ORDERS
// ================================

app.post("/orders", function(req,res){


    let orders = [];


    if(fs.existsSync("orders.json")){


        orders = JSON.parse(

            fs.readFileSync("orders.json")

        );


    }



    orders.push(req.body);



    fs.writeFileSync(

        "orders.json",

        JSON.stringify(
            orders,
            null,
            2
        )

    );



    res.json({

        success:true

    });


});


// ================================
// GET ORDERS
// ================================

app.get("/orders", function(req,res){


    let orders = [];


    if(fs.existsSync("orders.json")){


        orders = JSON.parse(

            fs.readFileSync("orders.json")

        );


    }


    res.json(orders);


});



// ================================
// UPDATE ORDER STATUS
// ================================

app.put("/orders/:id", function(req,res){


    let orders = [];


    if(fs.existsSync("orders.json")){


        orders = JSON.parse(

            fs.readFileSync("orders.json")

        );


    }



    const order = orders.find(function(order){


        return order.id == req.params.id;


    });



    if(order){


        order.status = req.body.status;



        fs.writeFileSync(

            "orders.json",

            JSON.stringify(
                orders,
                null,
                2
            )

        );



        res.json({

            success:true

        });


    }


    else{


        res.json({

            success:false

        });


    }


});


// ================================
// DELETE ORDER
// ================================

app.delete("/orders/:id", function(req,res){

    let orders = [];

    if(fs.existsSync("orders.json")){

        orders = JSON.parse(
            fs.readFileSync("orders.json")
        );

    }

    orders = orders.filter(function(order){

        return order.id != req.params.id;

    });


    fs.writeFileSync(

        "orders.json",

        JSON.stringify(
            orders,
            null,
            2
        )

    );


    res.json({

        success: true

    });

});


// ================================
// START SERVER
// ================================

app.post("/create-item", (req, res) => {

    const newItem = req.body;

    const filePath = path.join(__dirname, "data", "items.json");

    let items = JSON.parse(fs.readFileSync(filePath, "utf8"));

    items.push(newItem);

    fs.writeFileSync(
        filePath,
        JSON.stringify(items, null, 2)
    );

    res.json({
        message: "Item created successfully"
    });

});



// ================================
// EDIT ITEM
// ================================

app.put("/edit-item", (req, res) => {

    const filePath = path.join(__dirname, "data", "items.json");

    let items = JSON.parse(fs.readFileSync(filePath, "utf8"));


    const oldName = req.body.oldName;


    const index = items.findIndex(item => item.name === oldName);


    if(index !== -1){

        items[index] = req.body.item;


        fs.writeFileSync(
            filePath,
            JSON.stringify(items, null, 2)
        );


        res.json({
            success:true,
            message:"Item updated"
        });

    }

    else{

        res.json({
            success:false,
            message:"Item not found"
        });

    }

});




// ================================
// DELETE ITEM
// ================================

app.delete("/delete-item", (req, res) => {

    const filePath = path.join(__dirname, "data", "items.json");

    let items = JSON.parse(fs.readFileSync(filePath, "utf8"));


    const name = req.body.name;


    items = items.filter(item => item.name !== name);


    fs.writeFileSync(
        filePath,
        JSON.stringify(items, null, 2)
    );


    res.json({
        success:true,
        message:"Item deleted"
    });

});

app.get("/items", (req, res) => {

    const filePath = path.join(__dirname, "data", "items.json");

    const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

    res.json(items);

});

app.listen(PORT,function(){


    console.log(
        `Server running on port ${PORT}`
    );


});