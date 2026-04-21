# ♛ N-Queens Problem Solver
### DAA Project | Backtracking Algorithm | C++ + Node.js + Express

---

## 📁 Project Structure

```
NQueens-Project/
├── frontend/
│   ├── index.html      ← Main web page (UI)
│   ├── style.css       ← Styles and layout
│   └── script.js       ← Frontend logic (fetch API, draw board)
├── backend/
│   ├── server.js       ← Express web server (connects frontend to C++)
│   └── package.json    ← Node.js dependencies
├── nqueen.cpp          ← C++ backtracking algorithm
└── README.md           ← This file
```

---

## 🔧 Prerequisites

Make sure you have these installed:

| Tool | Download |
|------|----------|
| Node.js (v16+) | https://nodejs.org |
| g++ (C++ compiler) | Comes with MinGW (Windows) or GCC (Linux/Mac) |

---

## 🚀 Steps to Run the Project

### Step 1 — Clone or Download the Project
```bash
# Navigate to the project folder
cd NQueens-Project
```

### Step 2 — Compile the C++ File
This creates an executable that the Node.js server will run.

**On Windows (MinGW/MSVC):**
```bash
g++ -o nqueen.exe nqueen.cpp -std=c++17
```

**On Linux / macOS:**
```bash
g++ -o nqueen nqueen.cpp -std=c++17
```

> ✅ You should see a file `nqueen` (or `nqueen.exe`) appear in the root folder.

### Step 3 — Install Node.js Dependencies
```bash
cd backend
npm install
```

### Step 4 — Start the Backend Server
```bash
node server.js
```

You should see:
```
===========================================
  N-Queens Server running at:
  http://localhost:3000
===========================================
```

### Step 5 — Open the App in Browser
Open your browser and visit:
```
http://localhost:3000
```

Enter a value of N (e.g., 6) and click **Solve N-Queens**!

---

## ⚙️ How Backend Interacts with C++ (Simple Explanation)

```
FRONTEND (Browser)
      │
      │  POST /solve   { n: 6 }
      ▼
BACKEND (Node.js + Express)
      │
      │  exec("./nqueen 6")       ← Runs C++ like a terminal command
      ▼
C++ PROGRAM (nqueen / nqueen.exe)
      │
      │  Runs backtracking algorithm
      │  Prints solutions to stdout:
      │    4
      │    1 3 0 2
      │    2 0 3 1
      │    ...
      ▼
BACKEND
      │  Captures stdout output
      │  Parses it into JavaScript array
      │  Sends JSON response back
      ▼
FRONTEND
      │  Receives JSON
      │  Draws chessboard
      └  Shows all solutions
```

Think of it like this:
- **Frontend** = the face (what you see)
- **Backend** = the manager (receives requests, organizes work)
- **C++** = the worker (does the heavy computation)

---

## 📊 Time & Space Complexity

| Complexity | Value | Explanation |
|------------|-------|-------------|
| Worst Case Time | O(N!) | Try every permutation of N queens |
| Best Case Time | O(N) | First valid placement found immediately |
| Space | O(N²) | Board storage |
| Backtracking savings | Significant | Invalid branches are pruned early |

---

## 📚 Viva Questions & Answers

**Q1. What is the N-Queens Problem?**
> A: Place N chess queens on an N×N chessboard such that no two queens attack each other. Queens attack horizontally, vertically, and diagonally.

**Q2. What algorithm is used to solve it?**
> A: Backtracking. We place queens column by column, check if each placement is safe, and backtrack if it isn't.

**Q3. What is backtracking?**
> A: Backtracking is a technique where we incrementally build a solution and abandon (backtrack) a partial solution as soon as we detect it cannot lead to a valid complete solution.

**Q4. What is the time complexity?**
> A: Worst case is O(N!) because we try all permutations. In practice, backtracking prunes many branches, making it much faster.

**Q5. Why do we use C++ for the algorithm?**
> A: C++ is faster than JavaScript or Python for intensive computations. It compiles to native machine code, making the backtracking loop very fast.

**Q6. How does Node.js communicate with C++?**
> A: Node.js uses the `child_process.exec()` function to run the compiled C++ executable as a command-line program, just like running it in a terminal.

**Q7. How do you check if a queen is safe?**
> A: We check all previously placed queens. If any queen shares the same row, or if the absolute row difference equals the absolute column difference (diagonal), it is not safe.

**Q8. For N=8, how many solutions exist?**
> A: There are exactly 92 solutions for the classic 8-Queens problem.

**Q9. Are there any values of N with no solution?**
> A: Yes. N=2 and N=3 have no solutions. For all N ≥ 4, at least one solution exists.

**Q10. What is the space complexity?**
> A: O(N²) for storing the board, and O(N) for the recursion stack (at most N recursive calls deep).

**Q11. What is the difference between backtracking and brute force?**
> A: Brute force tries all N^N combinations (extremely slow). Backtracking prunes invalid placements early, testing only valid partial arrangements.

**Q12. What is the role of Express.js in this project?**
> A: Express.js creates a simple HTTP web server. It listens for requests from the frontend, runs the C++ solver, and sends back the results as JSON.

---

## 📄 Mini Project Report

### 1. Introduction
The N-Queens problem is a classic combinatorial problem in computer science and mathematics. The objective is to place N chess queens on an N×N chessboard so that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal. The problem is widely studied in the context of constraint satisfaction and backtracking algorithms in the Design and Analysis of Algorithms (DAA) course.

### 2. Objective
- Implement the N-Queens backtracking algorithm in C++
- Build a full-stack web application to visualize the solution
- Connect the C++ backend logic to a Node.js/Express web server
- Display all valid solutions with a visual chessboard
- Demonstrate algorithm efficiency through time complexity analysis

### 3. Algorithm (Backtracking)
```
FUNCTION solve(col):
    IF col == N:
        SAVE current board as solution
        RETURN

    FOR row FROM 0 TO N-1:
        IF isSafe(row, col):
            PLACE queen at (row, col)
            solve(col + 1)         ← recurse to next column
            REMOVE queen           ← backtrack

FUNCTION isSafe(row, col):
    FOR each previously placed queen at column c:
        IF same row OR same diagonal:
            RETURN false
    RETURN true
```

### 4. Time Complexity Analysis

| Case | Complexity | Reason |
|------|-----------|--------|
| Worst Case | O(N!) | All N rows tried for each column recursively |
| Average Case | Better than O(N!) | Many branches pruned by safety check |
| Space | O(N²) | Board array + recursion stack |

Backtracking dramatically reduces the search space compared to brute force O(N^N) by eliminating invalid branches as soon as a conflict is detected.

### 5. Results

| N | Solutions | Notes |
|---|-----------|-------|
| 1 | 1 | Trivial case |
| 2 | 0 | No solution |
| 3 | 0 | No solution |
| 4 | 2 | First non-trivial case |
| 5 | 10 | |
| 6 | 4 | |
| 8 | 92 | Classic 8-Queens |
| 10 | 724 | |

### 6. Technology Stack
- **Algorithm**: C++ with backtracking
- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Communication**: REST API (HTTP POST /solve)
- **Data Format**: JSON

### 7. Conclusion
This project successfully demonstrates the N-Queens problem using a backtracking algorithm implemented in C++. The full-stack web application provides an interactive, visual interface for exploring all valid solutions. The project highlights the power of backtracking as a problem-solving technique and demonstrates how C++ computation can be integrated into a modern web application through Node.js. The time complexity of O(N!) in the worst case is significantly improved by the early pruning property of backtracking.

---

## 👨‍💻 Author
DAA Mini Project — Design and Analysis of Algorithms
