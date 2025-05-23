// Reference: https://stackoverflow.com/questions/64507628/mongodb-docker-init-script
db = db.getSiblingDB('peerPrepDB');

db.createCollection('questions');

db.questions.insertMany([
    {
        title: "Reverse a String",
        description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
        categories: ["Strings", "Algorithms"],
        complexity: "Easy"
    },
    {
        title: "Linked List Cycle Detection",
        description: "Implement a function to detect if a linked list contains a cycle.",
        categories: ["Data Structures", "Algorithms"],
        complexity: "Easy"
    },
    {
        title: "Roman to Integer",
        description: "Given a roman numeral, convert it to an integer.",
        categories: ["Algorithms"],
        complexity: "Easy"
    },
    {
        title: "Add Binary",
        description: "Given two binary strings a and b, return their sum as a binary string.",
        categories: ["Bit Manipulation", "Algorithms"],
        complexity: "Easy"
    },
    {
        title: "Fibonacci Number",
        description: "The Fibonacci numbers form a sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
        categories: ["Recursion", "Algorithms"],
        complexity: "Easy"
    },
    {
        title: "Implement Stack using Queues",
        description: "Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).",
        categories: ["Data Structures"],
        complexity: "Easy"
    },
    {
        title: "Combine Two Tables",
        description: "Given two tables, Person and Address, write a solution to report the first name, last name, city, and state of each person. If the address is not present, report null instead.",
        categories: ["Databases"],
        complexity: "Easy"
    },
    {
        title: "Repeated DNA Sequences",
        description: "Given a string representing a DNA sequence, return all the 10-letter-long sequences that occur more than once in a DNA molecule.",
        categories: ["Algorithms", "Bit Manipulation"],
        complexity: "Medium"
    },
    {
        title: "Course Schedule",
        description: "Given an array of prerequisites where prerequisites[i] = [a_i, b_i], return true if you can finish all courses, otherwise return false.",
        categories: ["Data Structures", "Algorithms"],
        complexity: "Medium"
    },
    {
        title: "LRU Cache Design",
        description: "Design and implement an LRU (Least Recently Used) cache.",
        categories: ["Data Structures"],
        complexity: "Medium"
    },
    {
        title: "Longest Common Subsequence",
        description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
        categories: ["Strings", "Algorithms"],
        complexity: "Medium"
    },
    {
        title: "Rotate Image",
        description: "You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise).",
        categories: ["Arrays", "Algorithms"],
        complexity: "Medium"
    },
    {
        title: "Airplane Seat Assignment Probability",
        description: "n passengers board an airplane with exactly n seats. The first passenger picks a seat randomly. The rest of the passengers take their own seat if available or pick randomly. Return the probability that the nth person gets their own seat.",
        categories: ["Brainteaser"],
        complexity: "Medium"
    },
    {
        title: "Validate Binary Search Tree",
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
        categories: ["Data Structures", "Algorithms"],
        complexity: "Medium"
    },
    {
        title: "Sliding Window Maximum",
        description: "Given an array of integers and a sliding window of size k moving from left to right, return the maximum value in each sliding window.",
        categories: ["Arrays", "Algorithms"],
        complexity: "Hard"
    },
    {
        title: "N-Queen Problem",
        description: "The n-queens puzzle is to place n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.",
        categories: ["Algorithms"],
        complexity: "Hard"
    },
    {
        title: "Serialize and Deserialize a Binary Tree",
        description: "Serialization is converting a data structure into a format that can be stored or transmitted. Design an algorithm to serialize and deserialize a binary tree.",
        categories: ["Data Structures", "Algorithms"],
        complexity: "Hard"
    },
    {
        title: "Wildcard Matching",
        description: "Given an input string and a pattern, implement wildcard pattern matching with support for '?' (matches any single character) and '*' (matches any sequence of characters).",
        categories: ["Strings", "Algorithms"],
        complexity: "Hard"
    },
    {
        title: "Chalkboard XOR Game",
        description: "Alice and Bob take turns erasing numbers from a chalkboard. If erasing a number causes the bitwise XOR of all elements to become 0, that player loses. Return true if Alice wins, assuming optimal play.",
        categories: ["Brainteaser"],
        complexity: "Hard"
    },
    {
        title: "Trips and Users",
        description: "Given a table of taxi trips and users, write a solution to compute the cancellation rate of requests with unbanned users between '2013-10-01' and '2013-10-03'.",
        categories: ["Databases"],
        complexity: "Hard"
    }
]);

