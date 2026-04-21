
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

int N;                              
vector<int> board;                  
vector<vector<int>> allSolutions;   


bool isSafe(int row, int col) {

    for (int c = 0; c < col; c++) {
        int r = board[c];

        
        if (r == row) return false;

       
        if (abs(r - row) == abs(c - col)) return false;
    }
    return true; 
}


void solve(int col) {
    
    if (col == N) {
        allSolutions.push_back(board); 
        return;
    }

    
    for (int row = 0; row < N; row++) {
        if (isSafe(row, col)) {
            board[col] = row;  
            solve(col + 1);    
            board[col] = -1;  
        }
    }
}



int main(int argc, char* argv[]) {

    if (argc < 2) {
        cout << "ERROR: Please provide N as argument" << endl;
        return 1;
    }

    N = atoi(argv[1]);

  
    if (N < 1 || N > 15) {
        cout << "ERROR: N must be between 1 and 15" << endl;
        return 1;
    }

   
    board.assign(N, -1);

  
    solve(0);

    
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
