use('app');

// clean-up old collections first
db.users.drop();

// create collections
db.createCollection('users');
db.users.insertMany([
  {
    username: "Chris",
    email: "cg545@cornell.edu",
    password: "password",
    token: "",
    profile_picture_url: "",
    state: "New York",
    bio: "I made this website!",
  }
]);