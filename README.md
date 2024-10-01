# Build a Full E-Commerce Application with Next.js 13+ and Node.js

|                |                                                           |
| -------------- | --------------------------------------------------------- |
| **Tech Stack** | Next.js 13+, Node.js, Server Components & Actions         |
| **UI**         | Tailwind CSS, DaisyUI, Chart.js                           |
| **Database**   | MongoDB, Mongoose                                         |
| **Payment**    | PayPal, Stripe, Bank Transfer                             |
| **Deployment** | GitHub, Vercel, MongoDB Atlas                             |
| **Auth**       | Auth.js, Google Auth                                      |
| **Others**     | Cloudinary, Zustand, SWR                                  |

Welcome to the **Chill Academy E-Commerce Platform**—a comprehensive, full-featured e-commerce application built with the latest technologies in Next.js and Node.js. This platform is designed to provide a seamless shopping experience for customers and robust management tools for administrators.

![Chill Academy E-Commerce Platform](/public/app.jpg)

## Features

- **Product Listings and Details**: Browse and view detailed information about products.
- **User Authentication**: Secure sign-in and sign-out functionality with Auth.js and Google Auth.
- **Shopping Cart**: Add products to the cart and manage quantities.
- **Checkout Process**: Complete purchases using PayPal, Stripe, or Bank Transfer.
- **Admin Panel**: Administrators can manage products, orders, and handle bank transfers.
- **Customer Reviews**: Customers can leave reviews on products.
- **Responsive UI**: Designed with Tailwind CSS and DaisyUI for a seamless experience across devices.
- **Data Visualization**: Use Chart.js for displaying sales and user data.
- **Image Management**: Upload and manage product images with Cloudinary.
- **State Management**: Utilize Zustand for efficient state management.
- **Data Fetching**: Implement SWR for data fetching and caching.

## Table of Contents

- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Seeding Data](#seeding-data)
- [Usage](#usage)
  - [Customer Flow](#customer-flow)
  - [Admin Panel](#admin-panel)
- [Contributing](#contributing)
- [License](#license)

## Demo

[Live Demo](#) <!-- Add your live demo link here -->

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **Yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/basitali111/chill-store.git
   cd chill-academy-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

### Database Setup

#### Local MongoDB

- Install MongoDB from [here](https://www.mongodb.com/try/download/community).
- Ensure MongoDB is running on your machine.
- Update the MongoDB connection string in your application configuration to `mongodb://localhost/chill-academy`.

#### MongoDB Atlas

- Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a new cluster and get your connection string.
- Update the MongoDB connection string in your application configuration with your Atlas connection string.

### Seeding Data

Run the following command to seed the database with initial data:

```bash
npm run seed
# or
yarn seed
```

This will create an admin user and sample products.

- **Admin Credentials**
  - Email: `jhon@example.com`
  - Password: `123456`

## Usage

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Customer Flow

1. **Browse Products**: Navigate through the product listings.
2. **View Product Details**: Click on a product to see detailed information, including customer reviews.
3. **Add to Cart**: Select quantity and add products to your shopping cart.
4. **Checkout**: Proceed to checkout and choose a payment method (PayPal, Stripe, or Bank Transfer).
5. **Order Confirmation**: Receive confirmation of your order.

### Admin Panel

1. **Sign In as Admin**: Use the admin credentials to sign in.
2. **Manage Products**: Add, edit, or remove products.
3. **Handle Orders**: View and update order statuses, especially for bank transfers.
4. **User Management**: View registered users and manage their accounts.

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License.

---

**Note**: This application is a part of Chill Academy's initiative to provide cutting-edge educational resources and practical projects for developers.

For any queries or support, please contact [support@chillacademy.com](mailto:support@chillacademy.com).