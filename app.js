const mongoose = require("mongoose");
const dotenv = require("dotenv");
const prompt = require("prompt-sync")();
const Customer = require("./models/customer");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Displays the menu options.
const displayMenu = () => {
    console.log("What would you like to do?");
    console.log(" 1. Create a new customer");
    console.log(" 2. View all customers");
    console.log(" 3. Update a customer");
    console.log(" 4. Delete a customer");
    console.log(" 5. Exit");
};

// Creates a new customer.
const createCustomer = async () => {
    const name = prompt("Enter customer name: ");
    const age = parseInt(prompt("Enter customer age: "));
    const customer = new Customer({ name, age });
    await customer.save();
    console.log("Customer successfully created!");
};

// Retrieves and displays all customers.
const viewCustomers = async () => {
    const customers = await Customer.find();
    console.log("Customers:");
    customers.forEach((customer) => {
        console.log(
            `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
        );
    });
};

// Updates a customer's information.
const updateCustomer = async () => {
    const customers = await Customer.find();
    console.log("Below is a list of customers:");
    customers.forEach((customer) => {
        console.log(
            `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
        );
    });

    const customerId = prompt(
        "Copy and paste the id of the customer to update here: "
    );
    const newName = prompt("What is the customers new name? ");
    const newAge = parseInt(prompt("What is the customers new age? "));

    await Customer.findByIdAndUpdate(customerId, {
        name: newName,
        age: newAge,
    });
    console.log("Customer successfully updated!");
};

// Deletes a customer.
const deleteCustomer = async () => {
    const customers = await Customer.find();
    console.log("Below is a list of customers:");
    customers.forEach((customer) => {
        console.log(
            `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
        );
    });

    const customerId = prompt(
        "Copy and paste the id of the customer to delete here: "
    );
    await Customer.findByIdAndDelete(customerId);
    console.log("Customer successfully deleted!");
};

// Main function that runs the CRM application.
const main = async () => {
    console.log("Welcome to the CRM");

    while (true) {
        displayMenu();
        const choice = parseInt(prompt("Number of action to run: "));

        switch (choice) {
            case 1:
                await createCustomer();
                break;
            case 2:
                await viewCustomers();
                break;
            case 3:
                await updateCustomer();
                break;
            case 4:
                await deleteCustomer();
                break;
            case 5:
                console.log("Exiting...");
                mongoose.connection.close();
                process.exit(0);
            default:
                console.log("Invalid choice. Please try again.");
        }
        console.log();
    }
};

main();
