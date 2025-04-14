import { use, expect } from 'chai'
import chaiHttp from 'chai-http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../src/question-service/app.js';
import Question from '../src/question-service/models/Question.js';

const chai = use(chaiHttp)

let mongoServer;

function getTestQuestions() {
    return [
        {
            title: "Largest Palindromic Substring",
            description: "Given a string s, find the longest palindromic substring. You need to return the length of this substring.",
            categories: ["Strings", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Find All Duplicates in an Array",
            description: "Given an array of integers, find all elements that appear more than once in the array.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Merge Intervals",
            description: "Given a collection of intervals, merge all overlapping intervals.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Design a Hash Map",
            description: "Design and implement a simple hash map without using built-in hash map classes.",
            categories: ["Data Structures"],
            complexity: "Medium"
        },
        {
            title: "Find the Kth Smallest Element in an Array",
            description: "Given an unsorted array, find the k-th smallest element in it. The algorithm should run in O(n) time on average.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Maximum Product Subarray",
            description: "Given an integer array, find the contiguous subarray (containing at least one number) which has the largest product.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Climbing Stairs with Minimum Cost",
            description: "A person can climb stairs with a minimum cost to reach the top. Write a function to calculate the minimum cost to climb from the first step to the top.",
            categories: ["Dynamic Programming", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Find All Prime Numbers Less Than N",
            description: "Write a function to find all prime numbers less than n.",
            categories: ["Algorithms", "Math"],
            complexity: "Medium"
        },
        {
            title: "Single Number",
            description: "Given an array of integers, every element appears twice except for one. Find the single element that appears once.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Easy"
        },
        {
            title: "Move Zeroes",
            description: "Given an array, move all zeroes to the end while maintaining the relative order of the non-zero elements.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Easy"
        },
        {
            title: "Container With Most Water",
            description: "Given an array of non-negative integers representing the height of bars, find two bars that together contain the most water.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Valid Parentheses (Alternative Approach)",
            description: "Implement a function that checks if a given string contains valid parentheses. A different approach might use a stack or recursion.",
            categories: ["Strings", "Algorithms"],
            complexity: "Easy"
        },
        {
            title: "Count Bits",
            description: "Given an integer n, return an array of the count of 1-bits for all numbers from 0 to n.",
            categories: ["Bit Manipulation", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Group Anagrams",
            description: "Given a list of strings, group anagrams together.",
            categories: ["Strings", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Search Insert Position",
            description: "Given a sorted array and a target value, find the position where it would be if it were inserted into the array.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Easy"
        },
        {
            title: "Diameter of Binary Tree",
            description: "Given a binary tree, return the diameter of the tree. The diameter of a tree is the number of nodes on the longest path between two leaves in the tree.",
            categories: ["Data Structures", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Course Schedule II (Topological Sort)",
            description: "Given an array of prerequisites, find an ordering of the courses that allows a student to take all courses, or return an empty array if it's not possible.",
            categories: ["Data Structures", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Path Sum in Binary Tree",
            description: "Given a binary tree and a target sum, determine if the tree has a root-to-leaf path where the sum of the nodes equals the target sum.",
            categories: ["Data Structures", "Algorithms"],
            complexity: "Medium"
        },
        {
            title: "Maximal Rectangle",
            description: "Given a 2D binary matrix filled with 0's and 1's, find the maximal rectangle containing only 1's and return its area.",
            categories: ["Arrays", "Algorithms"],
            complexity: "Hard"
        },
        {
            title: "Minimum Window Substring",
            description: "Given two strings s and t, return the smallest substring of s that contains all the characters of t.",
            categories: ["Strings", "Algorithms"],
            complexity: "Hard"
        }
    ];            
}

// Finds a question by its title and returns the id of the question
const findIdByTitle = async (title) => {
    try {
        const question = await Question.findOne({ title: title });
        
        if (!question) {
            console.log('Question not found!');
            return;
        }
        
        return question._id;
    } catch (error) {
        console.error('Error finding question:', error);
    }
};

const questions = getTestQuestions();

describe('Question API Tests', function () {

    before(async function () {

        // If there's an existing mongoose connection, disconnect it
        if (mongoose.connection.readyState) {
            await mongoose.disconnect();
        }

        mongoServer = await MongoMemoryServer.create({
            instance: {
              timeout: 20000,       // 20 seconds
            }
        });
        
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
      
        console.log('Connected to in-memory MongoDB');
        
        // Clean up collection before tests
        await Question.deleteMany({});
        await Question.insertMany(questions);
    });

    // Clean up after tests
    after(async function () {
        // Disconnect and cleanup the in-memory MongoDB server
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    // Get /api/questions - should return all questions
    describe('GET /api/questions', function () {
        it('should return all questions', function (done) {
            chai.request(app)
                .get('/api/questions')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    
                    expect(res.body).to.have.property('question').that.is.an('array');
                    
                    expect(res.body.question.length).to.equal(questions.length);

                    const firstQuestion = res.body.question[0];
                    
                    expect(firstQuestion).to.have.property('title').equal(questions[0].title);
                    expect(firstQuestion).to.have.property('description').equal(questions[0].description);
                    
                    // Use Chai's deep equality to compare arrays
                    expect(firstQuestion.categories).to.deep.equal(questions[0].categories);
                    
                    expect(firstQuestion).to.have.property('complexity').equal(questions[0].complexity);

                    done();
                });
        })

    })

    describe('POST /api/questions', function () {
        it('should create a new question', function (done) {
            const newQuestion = { 
                title: "Longest Increasing Subsequence", 
                description: "Given an unsorted array of integers, find the length of the longest increasing subsequence.", 
                categories: ["Dynamic Programming", "Algorithms"], 
                complexity: "Medium" 
            };

            chai.request(app)
                .post('/api/questions')
                .send(newQuestion)
                .end((err, res) => {
                    
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('_id');
                    expect(res.body).to.have.property('title').equal(newQuestion.title);
                    expect(res.body).to.have.property('description').equal(newQuestion.description);
                    expect(res.body.categories).to.deep.equal(newQuestion.categories);
                    
                    expect(res.body).to.have.property('complexity').equal(newQuestion.complexity);
                    done();
                })

        });

        it('should return an error if a field is missing', function (done) {
            const newQuestion = { 
                title: "Word Break"     // Missing other required fields
            };
            
            chai.request(app)
                .post('/api/questions')
                .send(newQuestion)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.success).to.equal(false);
                    expect(res.body.message).to.equal('Please provide all fields');
                    done();
                });
        });

        // Tries to add a question with duplicate title
        it('should return an error if duplicate title exists', function (done) {
            const newQuestion = questions.at(4);
            chai.request(app)
                .post('/api/questions')
                .send(newQuestion)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.success).to.equal(false);
                    expect(res.body.message).to.equal('Duplicate title found! Please select a different title.');
                    done();
                });
            
        });

    });


    // PUT /api/questions/:id - should update a question
    describe('PUT /api/questions/:id', function () {

        const updatedQuestion = { 
            title: "Longest Increasing Subsequence", 
            description: "Find the length of the longest increasing subsequence in an unsorted array of integers.", 
            categories: ["Algorithms"], 
            complexity: "Medium" 
        };

        it('should update a question successfully', async function () {
            
            chai.request(app)
                .put(`/api/questions/${await findIdByTitle(updatedQuestion.title)}`)
                .send(updatedQuestion)
                .end((err, res) => {
                    
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('title').equal(updatedQuestion.title);
                    expect(res.body).to.have.property('description').equal(updatedQuestion.description);
                    expect(res.body).to.have.property('categories').to.deep.equal(updatedQuestion.categories);
                    expect(res.body).to.have.property('complexity').equal(updatedQuestion.complexity);
                    
                })

        });

  });

    // DELETE /api/questions/:id - should delete a question
    describe('DELETE /api/questions/:id', function () {

        it('should delete a question', async function () {

            const questionId = await findIdByTitle("Longest Increasing Subsequence");

            // Ensure questionId is valid before proceeding
            if (!questionId) {
                throw new Error('Question not found for deletion');
            }

            chai.request(app)
                .delete(`/api/questions/${questionId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('success').equal(true);
                    expect(res.body).to.have.property('message').equal("Question deleted!");

                });

        });

        it('should return 404 for invalid question ID', async function () {
            const invalidId = 'invalidObjectId';

            chai.request(app)
                .delete(`/api/questions/${invalidId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.success).to.be.false;
                    expect(res.body.message).to.equal('Invalid Question Id(Question not found)!');
                });
        });

        // Test for 500 error when the database connection is disconnected
        it('should return 500 if there is a server error', async function () {
            const questionId = await findIdByTitle('Largest Palindromic Substring');

            // Simulate a database connection error by disconnecting the database
            await mongoose.disconnect();  // Disconnect the in-memory DB to simulate a failure

            chai.request(app)
                .delete(`/api/questions/${questionId}`)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.success).to.be.false;
                    expect(res.body.message).to.equal('Server Error!');

                    // Reconnect to the in-memory MongoDB after the test
                    mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
                });
        });

    });

});