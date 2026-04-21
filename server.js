const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});



app.post('/solve', (req,res)=>{

    const n = parseInt(req.body.n);

    if(isNaN(n) || n<1 || n>15){
        return res.status(400).json({
            error:'Enter valid N between 1 and 15'
        });
    }

    let solutions=[];

    function isSafe(board,row,col){
        for(let i=0;i<col;i++){
            if(board[i]===row) return false;

            if(
               Math.abs(board[i]-row) ===
               Math.abs(i-col)
            ) return false;
        }
        return true;
    }

    function solve(board,col){

        if(col===n){
            solutions.push([...board]);
            return;
        }

        for(let row=0; row<n; row++){

            if(isSafe(board,row,col)){
                board[col]=row;
                solve(board,col+1);
            }

        }
    }

    let start=Date.now();

    solve([],0);

    let end=Date.now();

    res.json({
        n:n,
        count:solutions.length,
        solutions:solutions,
        time:end-start
    });

});


app.get('/health',(req,res)=>{
    res.json({
        status:'Server running'
    });
});


app.listen(PORT,()=>{
   console.log(
   `Server running at http://localhost:${PORT}`
   );
});