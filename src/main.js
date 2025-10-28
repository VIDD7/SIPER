// buat hamburger aktiv 
document.addEventListener('DOMContentLoaded', function() {
const menuButton = document.getElementById('menu-button');
const navMenu = document.querySelector('.navigation'); 

if (!menuButton || !navMenu) {
console.error('Menu button atau navigation menu tidak ditemukan.');
return;
}

menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('is-active');
    navMenu.classList.toggle('active');
});
});
// Script untuk kalkulator
// Storage untuk history
let calculationHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];

// Fungsi faktorial
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Fungsi permutasi biasa P(n,r)
function permutation(n, r) {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
}

// Fungsi kombinasi biasa C(n,r)
function combination(n, r) {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
}

// Fungsi permutasi dengan unsur sama
function permutationWithSameElements(n, sameElements) {
    let denominator = 1;
    sameElements.forEach(element => {
        denominator *= factorial(element);
    });
    return factorial(n) / denominator;
}

// Fungsi permutasi siklis
function circularPermutation(n) {
    return factorial(n - 1);
}

// Fungsi kombinasi dengan pengulangan
function combinationWithRepetition(n, r) {
    return combination(n + r - 1, r);
}

// Update formula display berdasarkan pilihan
document.getElementById('calculationType').addEventListener('change', function() {
    updateFormulaDisplay();
    toggleSameElementsInput();
});

function toggleSameElementsInput() {
    const sameElementsDiv = document.getElementById('sameElementsInput');
    const calculationType = document.getElementById('calculationType').value;
    
    if (calculationType === 'permutation_same') {
        sameElementsDiv.style.display = 'block';
    } else {
        sameElementsDiv.style.display = 'none';
    }
}

function updateFormulaDisplay() {
    const type = document.getElementById('calculationType').value;
    const formulaDiv = document.getElementById('formula');
    
    const formulas = {
        'permutation': 'P(n,r) = n! / (n-r)!',
        'permutation_same': 'P = n! / (n₁! × n₂! × n₃! × ...)',
        'circular': 'P(siklis) = (n-1)!',
        'combination': 'C(n,r) = n! / (r! × (n-r)!)',
        'combination_repeat': 'C(n+r-1, r) = (n+r-1)! / (r! × (n-1)!)'
    };
    
    formulaDiv.innerHTML = `<p><strong>Rumus:</strong> ${formulas[type]}</p>`;
}

// Main calculation function
function calculate() {
    const n = parseInt(document.getElementById('n').value);
    const r = parseInt(document.getElementById('r').value);
    const type = document.getElementById('calculationType').value;
    
    // Validasi input
    if (isNaN(n) || n < 0) {
        alert('Masukkan nilai n yang valid (bilangan bulat non-negatif)');
        return;
    }
    
    let result, explanation;
    
    try {
        switch(type) {
            case 'permutation':
                if (isNaN(r) || r < 0) throw new Error('Masukkan nilai r yang valid');
                result = permutation(n, r);
                explanation = `P(${n},${r}) = ${n}! / (${n}-${r})! = ${result}`;
                break;
                
            case 'combination':
                if (isNaN(r) || r < 0) throw new Error('Masukkan nilai r yang valid');
                result = combination(n, r);
                explanation = `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!) = ${result}`;
                break;
                
            case 'permutation_same':
                const sameElementsInput = document.getElementById('sameElements').value;
                if (!sameElementsInput) throw new Error('Masukkan jumlah unsur sama');
                
                const sameElements = sameElementsInput.split(',').map(num => parseInt(num.trim()));
                const sumSame = sameElements.reduce((a, b) => a + b, 0);
                
                if (sumSame !== n) throw new Error(`Total unsur sama (${sumSame}) harus sama dengan n (${n})`);
                
                result = permutationWithSameElements(n, sameElements);
                explanation = `P = ${n}! / (${sameElements.map(el => `${el}!`).join(' × ')}) = ${result}`;
                break;
                
            case 'circular':
                result = circularPermutation(n);
                explanation = `P(siklis) = (${n}-1)! = ${result}`;
                break;
                
            case 'combination_repeat':
                if (isNaN(r) || r < 0) throw new Error('Masukkan nilai r yang valid');
                result = combinationWithRepetition(n, r);
                explanation = `C(${n}+${r}-1, ${r}) = ${result}`;
                break;
        }
        
        // Display result
        document.getElementById('result').innerHTML = `
            <p><strong>Hasil:</strong> ${result}</p>
            <p><strong>Penjelasan:</strong> ${explanation}</p>
        `;
        
        // Add to history
        addToHistory(type, n, r, result, explanation);
        
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <p style="color: red;"><strong>Error:</strong> ${error.message}</p>
        `;
    }
}

// History functions
function addToHistory(type, n, r, result, explanation) {
    const historyItem = {
        type: type,
        n: n,
        r: r,
        result: result,
        explanation: explanation,
        timestamp: new Date().toLocaleString()
    };
    
    calculationHistory.unshift(historyItem);
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }
    
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyDiv = document.getElementById('history');
    
    if (calculationHistory.length === 0) {
        historyDiv.innerHTML = '<p>Belum ada riwayat perhitungan</p>';
        return;
    }
    
    historyDiv.innerHTML = calculationHistory.map(item => `
        <div class="history-item">
            <strong>${getTypeName(item.type)}</strong> - 
            n=${item.n}${item.r !== undefined ? `, r=${item.r}` : ''}
            <br>
            <small>Hasil: ${item.result}</small>
            <br>
            <small style="color: #666;">${item.timestamp}</small>
        </div>
    `).join('');
}

function getTypeName(type) {
    const names = {
        'permutation': 'Permutasi Biasa',
        'permutation_same': 'Permutasi Unsur Sama',
        'circular': 'Permutasi Siklis',
        'combination': 'Kombinasi Biasa',
        'combination_repeat': 'Kombinasi Pengulangan'
    };
    return names[type] || type;
}

function clearHistory() {
    calculationHistory = [];
    localStorage.removeItem('calcHistory');
    updateHistoryDisplay();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateFormulaDisplay();
    updateHistoryDisplay();
});