class Solution {
  public:
    
    int parent[1001];
    
    int findParent(int node)
    {
        if(parent[node] == node)
            return node;
        return parent[node] = findParent(parent[node]);
    }
    
    int kruskalsMST(int V, vector<vector<int>>& edges) {
        
        for(int i = 0; i < V; i++)
            parent[i] = i;
        

        sort(edges.begin(), edges.end(), [](vector<int> a, vector<int> b){
            return a[2] < b[2];
        });
        
        int totalWeight = 0;
        int count = 0;
        
        for(int i = 0; i < edges.size(); i++)
        {
            int u = edges[i][0];
            int v = edges[i][1];
            int w = edges[i][2];
            
            int pu = findParent(u);
            int pv = findParent(v);
            
            if(pu != pv)
            {
                parent[pv] = pu;
                totalWeight += w;
                count++;
                
                if(count == V - 1)
                    break;
            }
        }
        
        return totalWeight;
    }
};