const nInput        = document.getElementById('nInput');
const solveBtn      = document.getElementById('solveBtn');
const errorBox      = document.getElementById('errorBox');
const statsCard     = document.getElementById('statsCard');
const boardCard     = document.getElementById('boardCard');
const solutionsCard = document.getElementById('solutionsCard');
const chessboard    = document.getElementById('chessboard');
const solutionsList = document.getElementById('solutionsList');
const boardLegend   = document.getElementById('boardLegend');
const solCounter    = document.getElementById('solCounter');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');


let allSolutions   = [];   
let currentSolIdx  = 0;   


solveBtn.addEventListener('click', async () => {
    const n = parseInt(nInput.value);

    if (isNaN(n) || n < 1 || n > 15) {
        showError('Please enter a number between 1 and 15.');
        return;
    }

    hideError();
    setLoading(true);

    try {
        
        const response = await fetch('http://localhost:4000/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ n: n })  // Send { "n": 6 } to server
        });

        
        const data = await response.json();

        if (!response.ok) {
            
            showError(data.error || 'Server error. Please try again.');
            return;
        }

       
        allSolutions  = data.solutions;
        currentSolIdx = 0;

     
        document.getElementById('statN').textContent     = data.n;
        document.getElementById('statCount').textContent = data.count;
        document.getElementById('statTime').textContent  = data.time + ' ms';

    
        statsCard.classList.remove('hidden');

        if (allSolutions.length === 0) {
            
            showError(`No solution exists for N = ${n}.`);
            boardCard.classList.add('hidden');
            solutionsCard.classList.add('hidden');
        } else {
            
            drawBoard(allSolutions[0], n);
            buildSolutionList(allSolutions, n);
            updateNavButtons();

            
            boardCard.classList.remove('hidden');
            solutionsCard.classList.remove('hidden');

           
            boardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } catch (err) {
        
        showError('Could not connect to server. Make sure the backend is running on port 3000.');
        console.error(err);
    } finally {
        setLoading(false);
    }
});


function drawBoard(solution, n) {
    chessboard.innerHTML = '';  

    
    chessboard.style.gridTemplateColumns = `repeat(${n}, 1fr)`;


    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const square = document.createElement('div');
            square.classList.add('square');

            const isLight = (row + col) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark');

           
            if (solution[col] === row) {
                square.classList.add('has-queen');
                const queenEl = document.createElement('span');
                queenEl.classList.add('queen-symbol');
                queenEl.textContent = '♛';  
                square.appendChild(queenEl);
            }

            chessboard.appendChild(square);
        }
    }

   
    const positions = solution.map((row, col) => `C${col}→R${row}`).join('  ');
    boardLegend.textContent = `Positions: ${positions}`;
}


function buildSolutionList(solutions, n) {
    solutionsList.innerHTML = '';  

    solutions.forEach((sol, idx) => {
        const row = document.createElement('div');
        row.classList.add('solution-row');
        if (idx === 0) row.classList.add('active');

        
        const num = document.createElement('span');
        num.classList.add('sol-num');
        num.textContent = `#${idx + 1}`;

        
        const data = document.createElement('span');
        data.classList.add('sol-data');
        data.textContent = `[ ${sol.join(', ')} ]`;

      
        const miniBoard = buildMiniBoard(sol, n);

        row.appendChild(num);
        row.appendChild(data);
        row.appendChild(miniBoard);

        
        row.addEventListener('click', () => {
            currentSolIdx = idx;
            drawBoard(allSolutions[idx], n);
            updateNavButtons();
            updateCounter();
            highlightActiveSolution(idx);
        });

        solutionsList.appendChild(row);
    });
}


function buildMiniBoard(solution, n) {
    const container = document.createElement('div');
    container.classList.add('sol-mini-board');

    for (let col = 0; col < n; col++) {
        const colDiv = document.createElement('div');
        colDiv.classList.add('mini-col');

        for (let row = 0; row < n; row++) {
            const sq = document.createElement('div');
            sq.classList.add('mini-sq');

            if (solution[col] === row) {
                sq.classList.add('queen');  
            } else {
                sq.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            }

            colDiv.appendChild(sq);
        }

        container.appendChild(colDiv);
    }

    return container;
}


function changeSolution(direction) {
    const n = parseInt(nInput.value);
    currentSolIdx += direction;

    
    currentSolIdx = Math.max(0, Math.min(currentSolIdx, allSolutions.length - 1));

    drawBoard(allSolutions[currentSolIdx], n);
    updateNavButtons();
    updateCounter();
    highlightActiveSolution(currentSolIdx);

    const rows = solutionsList.querySelectorAll('.solution-row');
    if (rows[currentSolIdx]) {
        rows[currentSolIdx].scrollIntoView({ block: 'nearest' });
    }
}


function updateNavButtons() {
    prevBtn.disabled = (currentSolIdx <= 0);
    nextBtn.disabled = (currentSolIdx >= allSolutions.length - 1);
    updateCounter();
}


function updateCounter() {
    solCounter.textContent = `${currentSolIdx + 1} / ${allSolutions.length}`;
}


function highlightActiveSolution(idx) {
    const rows = solutionsList.querySelectorAll('.solution-row');
    rows.forEach((r, i) => {
        r.classList.toggle('active', i === idx);
    });
}


function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}


function hideError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}

function setLoading(isLoading) {
    if (isLoading) {
        solveBtn.classList.add('loading');
        solveBtn.querySelector('.btn-text').textContent = 'Solving...';
    } else {
        solveBtn.classList.remove('loading');
        solveBtn.querySelector('.btn-text').textContent = 'Solve N-Queens';
    }
}


nInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') solveBtn.click();
});
