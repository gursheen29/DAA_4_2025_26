class Solution {
  public:
    vector<int> maxOfSubarrays(vector<int>& arr, int k) {
        vector<int> ans;
        int n = arr.size();

        for(int i = 0; i <= n-k ; i++) {

            int maxi = arr[i];

            for(int j = i; j < i + k; j++) {
                if(arr[j] > maxi) {
                    maxi = arr[j];
                }
            }

            ans.push_back(maxi);
        }

        return ans;
    }
};