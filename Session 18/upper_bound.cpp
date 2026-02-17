#include <iostream>
using namespace std;

int main() 
{
    int a[50], n;
    cout << "Enter number of elements:- ";
    cin >> n;

    cout << "Enter elements:- ";
    for(int i = 0; i < n; i++)
    {
        cin >> a[i];
    }

    int key;
    cout << "Enter element to search: ";
    cin >> key;

    int start = 0;
    int end = n - 1;
    int ans = -1;

    while(start <= end)
    {
        int mid = start + (end - start) / 2;

        if(a[mid] > key)   // ONLY CHANGE HERE
        {
            ans = mid;
            end = mid - 1;
        }
        else
        {
            start = mid + 1;
        }
    }

    cout << ans;

    return 0;
}
