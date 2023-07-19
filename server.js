/*********************************************************************************

WEB322 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Vansh Rana
Student ID: 169672219 
Date: 30 June 2023
Cyclic Web App URL: https://comfortable-mite-pocketbook.cyclic.app
GitHub Repository URL: https://github.com/Vanshrana01/Web322-app.git

********************************************************************************/

const express = require('express')
const store_service = require('./store-service')
const app = express()
const port = process.env.PORT || 8080
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); // no { storage: storage }
const exphbs = require('express-handlebars');
const itemData = require("./store-service");



cloudinary.config({
  cloud_name: 'dzvfunw68',
  api_key: '988669558532177',
  api_secret: 'RQeeOL7uaN_6cTGIWSHX3sMz_CE',
  secure: true
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.engine('.hbs', exphbs({
  extname: ".hbs",
  defaultLayout: "main",
  helpers: {
    navLink: function (url, options) {
      return (
        '<li class="nav-item"><a  ' +
        (url == app.locals.activeRoute ? ' class="nav-link active" ' : ' class="nav-link" ') +
        ' href=" ' +
        url +
        '">' +
        options.fn(this) +
        "</a></li>"
      )
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    formatDate: function (dateObj) {
      let year = dateObj.getFullYear();
      let month = (dateObj.getMonth() + 1).toString();
      let day = dateObj.getDate().toString();
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
}));

app.get('/about', (req, res) => {
  res.status(200).render('about', { pageTitle: "Vansh Rana's Camp" });
});

app.get("/", (req, res) => {
  res.redirect("/shop");
});



app.get("/shop", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "post" objects
    let items = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "items"
      items = await itemData.getPublishedItems();
    }

    // sort the published items by postDate
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // get the latest post from the front of the list (element 0)
    let post = items[0];

    // store the "items" and "post" data in the viewData object (to be passed to the view)
    viewData.items = items;
    viewData.item = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await itemData.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});

app.get('/shop/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try {

    // declare empty array to hold "item" objects
    let items = [];

    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      items = await itemData.getPublishedItems();
    }

    // sort the published items by postDate
    items.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

    // store the "items" and "item" data in the viewData object (to be passed to the view)
    viewData.items = items;

  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the item by "id"
    viewData.item = await itemData.getItemById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Obtain the full list of "categories"
    let categories = await itemData.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results"
  }

  // render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData })
});

app.get('/items', (req, res) => {
  const cat = req.query.category;
  const mDate = req.query.minDate;

  if (cat) {
    store_service.getItemsByCategory(cat)
      .then((data) => {
        if (data.length > 0) {
          res.render('items', { items: data });
        } else {
          res.render('items', { message: 'no results' });
        }
      })
      .catch((err) => {
        res.render('items', { message: 'no results' });
      });
  } else if (mDate) {
    store_service.getItemsByMinDate(mDate)
      .then((data) => {
        if (data.length > 0) {
          res.render('items', { items: data });
        } else {
          res.render('items', { message: 'no results' });
        }
      })
      .catch((err) => {
        res.render('items', { message: 'no results' });
      });
  } else {
    store_service.getAllItems()
      .then((data) => {
        if (data.length > 0) {
          res.render('items', { items: data });
        } else {
          res.render('items', { message: 'no results' });
        }
      })
      .catch((err) => {
        res.render('items', { message: 'no results' });
      });
  }
});

app.get('/items/add', (req, res) => {
  res.render('addpost');
});


app.get('/items/:value', (req, res) => {
  const value = parseInt(req.params.value, 10);
  store_service.getItemById(value).then((data) => {
    res.json(data)
  }).catch((err) => {
    res.json(err);
  })
});

app.get('/categories', (req, res) => {
  store_service.getCategories().then((data) => {
    if (data.length > 0) {
      res.render("categories", { Items: data });
    } else {
      res.render("categories", { message: "No results" });
    }
  })
    .catch((error) => {
      res.render("categories", { error: "An error occurred while fetching data" });
    });
});



app.post('/items/add', upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    store_service.addItem(req.body);
    res.redirect('/items')
  }

});
app.get("/categories/add", (req, res) => {
  res.render("addCategory");
});

app.post("/categories/add", (req, res) => {
  store_service.addCategory(req.body).then((data) => {
    res.redirect("/categories");
  });
});

app.get("/categories/delete/:id", (req, res) => {
  store_service.deleteCategoryById(req.params.id).then((data) => {
    res.redirect("/categories");
  }).catch(err => {
    res.status(500).send("Unable to Remove Category / Category Not Found");
  });
});

app.get("/posts/delete/:id", (req, res) => {
  store_service.deletePostById(req.params.id).then((data) => {
    res.redirect("/items");
  }).catch(err => {
    res.status(500).send("Unable to Remove Post / Post Not Found");
  });
});

app.get('*', function (req, res) {
  res.send('Page not found, check URL', 404);
});



function onHTTPstart() {
  console.log("server started on port: " + port)
}

store_service.initialize().then(function () {
  app.listen(port, onHTTPstart);
}).catch(function (err) {
  console.log("unable to start" + err)
})


app.use((req, res, next) => {
  res.status(404).render("404");
});



