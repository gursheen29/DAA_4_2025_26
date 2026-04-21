class Solution {
public:

    bool canPaint(vector<int> &arr, int k, long long maxTime)
    {
        long long current = 0;
        int painters = 1;

        for(int i = 0; i < arr.size(); i++)
        {
            if(current + arr[i] <= maxTime)
            {
                current += arr[i];
            }
            else
            {
                painters++;
                current = arr[i];

                if(painters > k)
                    return false;
            }
        }

        return true;
    }

    long long minTime(vector<int>& arr, int k)
    {
        long long low = 0, high = 0;

        for(int i = 0; i < arr.size(); i++)
        {
            low = max(low, (long long)arr[i]);
            high += arr[i];
        }

        long long ans = high;

        while(low <= high)
        {
            long long mid = low + (high - low) / 2;

            if(canPaint(arr, k, mid))
            {
                ans = mid;
                high = mid - 1;   
            }
            else
            {
                low = mid + 1;    
            }
        }

        return ans;
    }
};
