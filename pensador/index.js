const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();
const port = 3333;

const conn = require("./db/conn");

//import models
const user = require("./models/user");
const tought = require("./models/tought");

//import rotas
const toughtRoutes = require("./routes/toughtsRoutes");
const authRouters = require("./routes/authRouters");

// import controller
const ToughtController = require("./controllers/ToughtController");

//configurar engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//configurar json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware para as sessões
app.use(
  session({
    name: "session",
    secret: "nosso_secrect", //quanto maior a crypto melhor
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);
//importar as flashs
app.use(flash());

// importar arquivos estáticos
app.use(express.static("public"));

//armazenar as sessões nas rotas
app.use((request, response, next) => {
  if (request.session.userId) {
    response.locals.session = request.session;
  }
  next();
});

//rotas
app.use("/toughts", toughtRoutes);
app.use('/', authRouters)

app.get("/", ToughtController.showToughts); //home

//Conexão e criação das tabelas do banco
conn
  // .sync({force:true})

  .sync()
  .then(() => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
