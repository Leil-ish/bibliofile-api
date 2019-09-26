# Bibliofile API

![Landing Page](https://i.imgur.com/ZXs9P3Y.png)

This is the backend for a fullstack virtual library project called Bibliofile, found online at <https://leil-ish-bibliofile-app.now.sh/> with backend hosted at <https://guarded-taiga-77278.herokuapp.com/>. It allows users to:

* Search for books using an interface that pulls from the Google Books API  

![Search Interface](https://i.imgur.com/uZkzA5t.png)

* Add those books (along with their descriptions, author and genre information, etc.) to a personal virtual library with one click  

![Book results page showing Harry Potter book](https://i.imgur.com/Or6HkVK.png)

* Add books manually in the event that they cannot be found on Google Books  

![Add book page](https://i.imgur.com/jZkzigi.png)

* Add notes to the books in their libraries  

![Notes page](https://i.imgur.com/MkCnkJJ.png)

To get started, click "Register" on the landing page and enter your name, username, and password. On this page, you can also send me an email, check out my portfolio site, or visit me on LinkedIn or GitHub.  

![Landing Page](https://i.imgur.com/LIIFeCD.png)

From there, you can navigate using the fixed nav icons at the top left.  

![Header](https://i.imgur.com/ZXs9P3Y.png)  

The API endpoints that are useful in using this app are:

* <https://guarded-taiga-77278.herokuapp.com/api/library> - gets all books
* <https://guarded-taiga-77278.herokuapp.com/api/notes> - gets all notes
* <https://guarded-taiga-77278.herokuapp.com/api/library/:book_id> - gets a book by ID
* <https://guarded-taiga-77278.herokuapp.com/api/library/:book_id/notes> - gets notes related to a particular book
* <https://guarded-taiga-77278.herokuapp.com/api/library/:book_id/:note_id> - gets a particular note related to a particular book

Endpoints that specify a particular resource can handle DELETE and GET requests. All other endpoints can handle GET and POST requests. All endpoints beyond the landing page require JWT authentication, most easily accomplished by registering at <https://leil-ish-bibliofile-app.now.sh/> and getting an auth token.

This project was created using React on the frontend and Node.js, Express, and PostgreSQL on the backend. If you like this repo, you can find its backend companion at <https://github.com/Leil-ish/bibliofile-client>!
