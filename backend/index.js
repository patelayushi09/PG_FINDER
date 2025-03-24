const express = require("express") //express....
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()

const port = process.env.PORT

//express object..
const app = express()
app.use(cors()) // *
app.use(express.json()) //to accept data as json...
app.use(express.urlencoded({ extended: true }));


async function main() {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000 // Timeout after 5 seconds instead of the default 30 seconds

    });
}

main().then(() => console.log("Mongodb connected successfully!")).catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("pg_finder server is running...");
})


// import admin routes
const adminRoutes = require('./src/routes/adminRoutes')
app.use("/admin", adminRoutes)

//import landlord routes
const landlordRoutes = require('./src/routes/landlordRoutes')
app.use("/landlord", landlordRoutes)

//import tenant routes
const tenantRoutes = require('./src/routes/tenantRoutes')
app.use("/tenant",tenantRoutes )

//import state routes
const stateRoutes = require('./src/routes/stateRoutes')
app.use("/state",stateRoutes )

//import city routes
const cityRoutes = require('./src/routes/cityRoutes')
app.use("/city",cityRoutes )

//import area routes
const areaRoutes = require('./src/routes/areaRoutes')
app.use("/area",areaRoutes )

/

app.listen(port, () => {
    console.log(`PG_FINDER listening on port ${port}`);
})