# Wanderlust

Wanderlust
🌍 # Your Next Adventure Awaits
Wanderlust is a web application inspired by Airbnb, designed to help users discover and list unique accommodations. Whether you're looking for a cozy cabin, a vibrant city apartment, or a serene beachfront villa, Wanderlust aims to connect travelers with their ideal stays.

✨  # Features
Based on the technologies used, Wanderlust likely includes the following key features:

User Authentication: Secure user registration, login, and logout functionalities.

Listing Management: Users can create, view, update, and delete their own accommodation listings.

Image Uploads: Seamlessly upload and manage listing images, with storage handled by Cloudinary.

Geocoding & Maps: Display listing locations on interactive maps (likely powered by MapTiler) and convert addresses to geographical coordinates.

Flash Messages: Provide informative feedback to users for various actions (e.g., successful listing creation, error messages).

Server-Side Validation: Robust input validation for user data and listings.

Database Integration: Store and manage all application data with MongoDB.

Responsive Design: A user-friendly interface that adapts to different screen sizes.

🚀  # Technologies Used
Wanderlust is built using a robust stack of modern web technologies:

Backend:

Node.js (v22.11.0)

Express.js: Fast, unopinionated, minimalist web framework.

MongoDB & Mongoose: NoSQL database and an ODM for Node.js.

Passport.js: Authentication middleware, specifically passport-local and passport-local-mongoose.

Cloudinary: Cloud-based image and video management.

Multer & Multer-Storage-Cloudinary: For handling file uploads to Cloudinary.

Dotenv: Loads environment variables.

Frontend:

EJS (Embedded JavaScript): Templating engine.

EJS-Mate: Layout and partials support for EJS.

MapTiler SDK: Likely for interactive maps.

Utilities & Middleware:

Connect-Flash: Flash messages.

Connect-Mongo: MongoDB session store for Express.

Method-Override: Enables PUT/DELETE requests where not natively supported.

Joi: Data validation.

Node-Geocoder: Geocoding library.

Axios: Promise-based HTTP client.

CORS: Cross-Origin Resource Sharing.

🛠️ Installation & Setup
Follow these steps to get Wanderlust up and running on your local machine:

Clone the repository:

git clone https://github.com/YourUsername/Wanderlust.git
cd Wanderlust

Install dependencies:

npm install

Set up environment variables:
Create a file named .env in the root directory of your project and add the following:

DB_URL=YOUR_MONGODB_CONNECTION_STRING
MAP_TILE_TOKEN=YOUR_MAPTILER_API_KEY
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
SECRET=YOUR_SESSION_SECRET_KEY

Replace YOUR_MONGODB_CONNECTION_STRING with your MongoDB connection string (e.g., mongodb://localhost:27017/wanderlust for local or a MongoDB Atlas URI).

Replace YOUR_MAPTILER_API_KEY with your API key from your MapTiler Cloud account.

Replace YOUR_CLOUDINARY_CLOUD_NAME, YOUR_CLOUDINARY_API_KEY, and YOUR_CLOUDINARY_API_SECRET with your credentials from your Cloudinary dashboard.

Replace YOUR_SESSION_SECRET_KEY with a strong, random string for express-session.

Start the server:

node app.js

The application should now be running at http://localhost:3000 (or the port you've configured).

🤝 Contributing
This project is a personal endeavor. While I'm not actively seeking external contributions at this moment, feel free to fork the repository, experiment, and learn!

📄 License
This project is licensed under the ISC License.

📞 Contact
If you have any questions or feedback, feel free to reach out to tiwariakash03789@gmail.com.