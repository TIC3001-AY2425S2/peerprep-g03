import { createUser } from "./user-controller";
import * as repository from "../model/repository.js";
import bcrypt from "bcrypt";

jest.mock("../model/repository.js", () => ({
    findUserByUsernameOrEmail: jest.fn(),
    createUser: jest.fn(),
}));

jest.mock("bcrypt", () => ({
    genSaltSync: jest.fn(),
    hashSync: jest.fn(),
}));

describe("createUser", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: "testuser",
                email: "testuser@example.com",
                password: "password123",
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it("should hash the password before creating a new user", async () => {
        repository.findUserByUsernameOrEmail.mockResolvedValue(null);
        repository.createUser.mockResolvedValue({
            id: "123",
            username: "testuser",
            email: "testuser@example.com",
            isAdmin: false,
            createdAt: new Date(),
        });

        bcrypt.genSaltSync.mockReturnValue("salt");
        bcrypt.hashSync.mockReturnValue("hashedPassword");

        await createUser(req, res);

        expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
        expect(bcrypt.hashSync).toHaveBeenCalledWith("password123", "salt");
        
        // Assert bcrypt's hashSync function was called with the plain password and salt
        expect(bcrypt.hashSync).toHaveBeenCalledWith("password123", "salt");
        
        // Assert that the password is securely hashed, i.e. hashed password is not the same as the plain text password
        const hashedPassword = bcrypt.hashSync("password123", "salt");
        expect(hashedPassword).not.toBe("password123"); 
        
        expect(repository.createUser).toHaveBeenCalledWith("testuser", "testuser@example.com", "hashedPassword");
    });

    it("should not store password in plain text", async () => {
        // Mock user creation
        repository.findUserByUsernameOrEmail.mockResolvedValue(null);
        repository.createUser.mockResolvedValue({
            id: "123",
            username: "testuser",
            email: "testuser@example.com",
            isAdmin: false,
            createdAt: new Date(),
            password: bcrypt.hashSync("password123", "salt"), // Mock hashed password
        });

        bcrypt.genSaltSync.mockReturnValue("salt");
        bcrypt.hashSync.mockReturnValue("hashedPassword");

        await createUser(req, res);

        // Get the mock user from the repository and check password is not plain text (i.e. hashed)
        const createdUser = await repository.createUser.mock.results[0].value;
        expect(createdUser.password).not.toBe("password123");
    });

    it("should create a new user successfully", async () => {
        repository.findUserByUsernameOrEmail.mockResolvedValue(null);
        repository.createUser.mockResolvedValue({
            id: "123",
            username: "testuser",
            email: "testuser@example.com",
            isAdmin: false,
            createdAt: new Date(),
        });
        bcrypt.genSaltSync.mockReturnValue("salt");
        bcrypt.hashSync.mockReturnValue("hashedPassword");

        await createUser(req, res);

        // Check that the password is hashed correctly before storing
        expect(bcrypt.hashSync).toHaveBeenCalledWith("password123", "salt");

        expect(repository.findUserByUsernameOrEmail).toHaveBeenCalledWith("testuser", "testuser@example.com");
        expect(repository.createUser).toHaveBeenCalledWith("testuser", "testuser@example.com", "hashedPassword");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Created new user testuser successfully",
            data: {
                id: "123",
                username: "testuser",
                email: "testuser@example.com",
                isAdmin: false,
                createdAt: expect.any(Date),
            },
        });
    });

    it("should return 409 if username or email already exists", async () => {
        repository.findUserByUsernameOrEmail.mockResolvedValue({ id: "123" });

        await createUser(req, res);

        expect(repository.findUserByUsernameOrEmail).toHaveBeenCalledWith("testuser", "testuser@example.com");
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: "username or email already exists" });
    });

    it("should return 400 if username, email, or password is missing", async () => {
        req.body = { username: "testuser", email: "" };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "username and/or email and/or password are missing" });
    });

    it("should return 500 if an unknown error occurs", async () => {
        repository.findUserByUsernameOrEmail.mockRejectedValue(new Error("Database error"));

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Unknown error when creating new user!" });
    });
});