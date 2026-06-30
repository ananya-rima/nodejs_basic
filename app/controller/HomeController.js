const jwt = require("jsonwebtoken");
// all controller build in class controller

class HomeController {
  index(req, res) {
    let user = null;

    if (req.cookies.token) {
      user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    }

    const arr = [
      {
        id: 1,
        name: "Ananya Chatterjee",
        city: "Kolkata",
        username: "ana",
        email: "a@gmail.com",
        image: "https://picsum.photos/300/200",
      },
      {
        id: 2,
        name: "Rima Chatterjee",
        city: "Kolkata",
        username: "Rim",
        email: "b@gmail.com",
        image: "https://picsum.photos/300/201",
      },

      {
        id: 3,
        name: "Jyotsna Chatterjee",
        city: "Howrah",
        username: "jyo",
        email: "c@gmail.com",
        image: "https://picsum.photos/300/201",
      },

      {
        id: 4,
        name: "Uttam Chatterjee",
        city: "Barasat",
        username: "uttm",
        email: "d@gmail.com",
        image: "https://picsum.photos/300/200",
      },

      {
        id: 5,
        name: "Nupur Chatterjee",
        city: "Birati",
        username: "nup",
        email: "e@gmail.com",
        image: "https://picsum.photos/300/200",
      },

      {
        id: 6,
        name: "XXXX Chatterjee",
        city: "Bankura",
        username: "ana",
        email: "f@gmail.com",
        image: "https://picsum.photos/300/201",
      },
    ];
    res.render("home", {
      title: "Home Page",
      users: arr,
      user: user,
    });
  }

  about(req, res) {
    // res.send("<h1> This is my About page");
    res.render("about", {
      title: "about page",
    });
  }
  contact(req, res) {
    res.send("<h1> This is my Contact page");
  }

  index1(req, res) {
    res.render("index1", {
      title: "index1 page",
    });
  }
}

module.exports = new HomeController();

// as its a class we have to made object using new keyword.
