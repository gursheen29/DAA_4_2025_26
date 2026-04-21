#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n;

    char arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    unordered_map<int, int> mp;
    int sum = 0;
    int maxLen = 0;

    mp[0] = -1;

    for (int i = 0; i < n; i++) {
        if (arr[i] == 'P')
            sum++;
        else
            sum--;

        if (mp.find(sum) != mp.end()) {
            int len = i - mp[sum];
            if (len > maxLen)
                maxLen = len;
        } else {
            mp[sum] = i;
        }
    }

    cout << maxLen;
    return 0;
}
