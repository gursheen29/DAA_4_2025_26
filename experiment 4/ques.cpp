#include <bits/stdc++.h>
using namespace std;

int main() {
    int K = 3;
    vector<int> scores = {10, 20, 5, 15, 25, 8};

    priority_queue<int, vector<int>, greater<int>> minHeap;

    for (int i = 0; i < scores.size(); i++) {
        if (minHeap.size() < K) {
            minHeap.push(scores[i]);
            if (minHeap.size() < K)
                cout << -1 << " ";
            else
                cout << minHeap.top() << " ";
        } else {
            if (scores[i] > minHeap.top()) {
                minHeap.pop();
                minHeap.push(scores[i]);
            }
            cout << minHeap.top() << " ";
        }
    }

    return 0;
}
