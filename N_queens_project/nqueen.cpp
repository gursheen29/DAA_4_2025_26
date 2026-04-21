/*
 * ============================================================
 *  N-Queens Problem - Backtracking Algorithm
 *  File: nqueen.cpp
 *  
 *  HOW IT WORKS (Simple Explanation):
 *  - We place queens one column at a time (left to right)
 *  - For each column, we try placing a queen in each row
 *  - Before placing, we CHECK if it is safe (no queen attacks it)
 *  - If safe → place the queen and move to next column
 *  - If not safe → try next row (backtrack)
 *  - If all columns are filled → we found a solution!
 * ============================================================
 */

#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

// -------------------------------------------------------
// Global variables
// -------------------------------------------------------
int N;                              // Size of the board (N x N)
vector<int> board;                  // board[col] = row where queen is placed in that column
vector<vector<int>> allSolutions;   // Stores all valid solutions found

// -------------------------------------------------------
// isSafe: Checks if placing a queen at (row, col) is safe
// A queen is NOT safe if another queen is in:
//   1. Same row
//   2. Same diagonal (upper-left or lower-left)
// -------------------------------------------------------
bool isSafe(int row, int col) {
    // Check all previously placed queens (columns 0 to col-1)
    for (int c = 0; c < col; c++) {
        int r = board[c]; // Row of queen in column c

        // Same row check
        if (r == row) return false;

        // Diagonal check:
        // If the difference in rows equals difference in columns → diagonal attack
        if (abs(r - row) == abs(c - col)) return false;
    }
    return true; // Safe to place
}

// -------------------------------------------------------
// solve: Recursive backtracking function
// col → current column we are trying to place a queen in
// -------------------------------------------------------
void solve(int col) {
    // Base case: All N queens placed successfully!
    if (col == N) {
        allSolutions.push_back(board); // Save this solution
        return;
    }

    // Try placing queen in each row of current column
    for (int row = 0; row < N; row++) {
        if (isSafe(row, col)) {
            board[col] = row;  // Place queen
            solve(col + 1);    // Move to next column
            board[col] = -1;   // Remove queen (backtrack)
        }
    }
}

// -------------------------------------------------------
// main: Entry point
// Reads N from command line arguments
// Outputs solutions in a simple format for Node.js to parse
// -------------------------------------------------------
int main(int argc, char* argv[]) {
    // Read N from command-line argument
    if (argc < 2) {
        cout << "ERROR: Please provide N as argument" << endl;
        return 1;
    }

    N = atoi(argv[1]); // Convert string argument to integer

    // Validate N
    if (N < 1 || N > 15) {
        cout << "ERROR: N must be between 1 and 15" << endl;
        return 1;
    }

    // Initialize board with -1 (no queen placed)
    board.assign(N, -1);

    // Start solving from column 0
    solve(0);

    // -------------------------------------------------------
    // Output format (read by Node.js backend):
    // Line 1: Total number of solutions
    // Next lines: Each solution as space-separated row positions
    // Example for N=4:
    //   2
    //   1 3 0 2
    //   2 0 3 1
    // -------------------------------------------------------
    cout << allSolutions.size() << endl;

    for (auto& sol : allSolutions) {
        for (int i = 0; i < N; i++) {
            cout << sol[i];
            if (i < N - 1) cout << " ";
        }
        cout << endl;
    }

    return 0;
}
