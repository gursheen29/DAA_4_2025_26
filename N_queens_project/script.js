/*
 * ============================================================
 *  N-Queens Frontend Logic
 *  File: frontend/script.js
 *
 *  WHAT THIS FILE DOES:
 *  1. Listens for button click → sends N to backend
 *  2. Receives solutions from backend as JSON
 *  3. Draws the chessboard with queens placed
 *  4. Shows stats: solution count, time taken
 *  5. Lists all solutions and lets user click through them
 * ============================================================
 */

// ---- DOM element references ----
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

// ---- Application state ----
let allSolutions   = [];   // Array of all solutions from backend
let currentSolIdx  = 0;    // Which solution is being shown on the board

// =============================================
//  MAIN: Called when "Solve" button is clicked
// =============================================
solveBtn.addEventListener('click', async () => {
    const n = parseInt(nInput.value);

    // Client-side validation
    if (isNaN(n) || n < 1 || n > 15) {
        showError('Please enter a number between 1 and 15.');
        return;
    }

    hideError();
    setLoading(true);

    try {
        // -------------------------------------------
        // Send a POST request to our Express backend
        // The backend will run the C++ solver
        // -------------------------------------------
        const response = await fetch('http://localhost:4000/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ n: n })  // Send { "n": 6 } to server
        });

        // Parse the JSON response from the server
        const data = await response.json();

        if (!response.ok) {
            // Server returned an error
            showError(data.error || 'Server error. Please try again.');
            return;
        }

        // -------------------------------------------
        // SUCCESS! We got solutions from the server
        // -------------------------------------------
        allSolutions  = data.solutions;
        currentSolIdx = 0;

        // Update stats panel
        document.getElementById('statN').textContent     = data.n;
        document.getElementById('statCount').textContent = data.count;
        document.getElementById('statTime').textContent  = data.time + ' ms';

        // Show the stats card (it was hidden initially)
        statsCard.classList.remove('hidden');

        if (allSolutions.length === 0) {
            // No solution exists (e.g. N=2 or N=3 have no solutions)
            showError(`No solution exists for N = ${n}.`);
            boardCard.classList.add('hidden');
            solutionsCard.classList.add('hidden');
        } else {
            // Draw board and list all solutions
            drawBoard(allSolutions[0], n);
            buildSolutionList(allSolutions, n);
            updateNavButtons();

            // Reveal the hidden cards
            boardCard.classList.remove('hidden');
            solutionsCard.classList.remove('hidden');

            // Scroll to the board
            boardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    } catch (err) {
        // Network error (server not running, etc.)
        showError('Could not connect to server. Make sure the backend is running on port 3000.');
        console.error(err);
    } finally {
        setLoading(false);
    }
});

// =============================================
//  drawBoard: Renders the N×N chessboard
//  solution = array of row indices, e.g. [1,3,0,2]
//  Meaning: in column 0, queen is at row 1
//           in column 1, queen is at row 3, etc.
// =============================================
function drawBoard(solution, n) {
    chessboard.innerHTML = '';  // Clear previous board

    // Set CSS grid: N columns of equal size
    chessboard.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    // Loop through rows and columns to create squares
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const square = document.createElement('div');
            square.classList.add('square');

            // Alternating light/dark pattern
            // (row + col) even = light square; odd = dark square
            const isLight = (row + col) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark');

            // Check if a queen should be placed here
            // solution[col] tells us which ROW has the queen in that column
            if (solution[col] === row) {
                square.classList.add('has-queen');
                const queenEl = document.createElement('span');
                queenEl.classList.add('queen-symbol');
                queenEl.textContent = '♛';  // Queen chess symbol
                square.appendChild(queenEl);
            }

            chessboard.appendChild(square);
        }
    }

    // Show queen position legend below the board
    const positions = solution.map((row, col) => `C${col}→R${row}`).join('  ');
    boardLegend.textContent = `Positions: ${positions}`;
}

// =============================================
//  buildSolutionList: Creates clickable list
//  of all solutions with mini preview boards
// =============================================
function buildSolutionList(solutions, n) {
    solutionsList.innerHTML = '';  // Clear previous list

    solutions.forEach((sol, idx) => {
        const row = document.createElement('div');
        row.classList.add('solution-row');
        if (idx === 0) row.classList.add('active');

        // Solution number
        const num = document.createElement('span');
        num.classList.add('sol-num');
        num.textContent = `#${idx + 1}`;

        // Solution data (row positions)
        const data = document.createElement('span');
        data.classList.add('sol-data');
        data.textContent = `[ ${sol.join(', ')} ]`;

        // Mini chessboard preview
        const miniBoard = buildMiniBoard(sol, n);

        row.appendChild(num);
        row.appendChild(data);
        row.appendChild(miniBoard);

        // Click to jump to this solution on the big board
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

// =============================================
//  buildMiniBoard: Creates a tiny visual preview
//  of a solution (shown in the solutions list)
// =============================================
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
                sq.classList.add('queen');  // Gold square = queen
            } else {
                sq.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            }

            colDiv.appendChild(sq);
        }

        container.appendChild(colDiv);
    }

    return container;
}

// =============================================
//  changeSolution: Called by Prev/Next buttons
//  direction = -1 (prev) or +1 (next)
// =============================================
function changeSolution(direction) {
    const n = parseInt(nInput.value);
    currentSolIdx += direction;

    // Clamp to valid range
    currentSolIdx = Math.max(0, Math.min(currentSolIdx, allSolutions.length - 1));

    drawBoard(allSolutions[currentSolIdx], n);
    updateNavButtons();
    updateCounter();
    highlightActiveSolution(currentSolIdx);

    // Scroll the active solution into view in the list
    const rows = solutionsList.querySelectorAll('.solution-row');
    if (rows[currentSolIdx]) {
        rows[currentSolIdx].scrollIntoView({ block: 'nearest' });
    }
}

// =============================================
//  Helper: Update Prev/Next button states
// =============================================
function updateNavButtons() {
    prevBtn.disabled = (currentSolIdx <= 0);
    nextBtn.disabled = (currentSolIdx >= allSolutions.length - 1);
    updateCounter();
}

// =============================================
//  Helper: Update "X / Y" counter text
// =============================================
function updateCounter() {
    solCounter.textContent = `${currentSolIdx + 1} / ${allSolutions.length}`;
}

// =============================================
//  Helper: Highlight the active row in solutions list
// =============================================
function highlightActiveSolution(idx) {
    const rows = solutionsList.querySelectorAll('.solution-row');
    rows.forEach((r, i) => {
        r.classList.toggle('active', i === idx);
    });
}

// =============================================
//  Helper: Show an error message
// =============================================
function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

// =============================================
//  Helper: Hide the error message
// =============================================
function hideError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}

// =============================================
//  Helper: Toggle loading state on the button
// =============================================
function setLoading(isLoading) {
    if (isLoading) {
        solveBtn.classList.add('loading');
        solveBtn.querySelector('.btn-text').textContent = 'Solving...';
    } else {
        solveBtn.classList.remove('loading');
        solveBtn.querySelector('.btn-text').textContent = 'Solve N-Queens';
    }
}

// ---- Allow pressing Enter in the input to trigger solve ----
nInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') solveBtn.click();
});
