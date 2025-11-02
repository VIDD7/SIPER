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
const calculationTypeEl = document.getElementById('calculationType');

// Hanya jalankan kode kalkulator jika elemen 'calculationType' ada di halaman
if (calculationTypeEl) { 
    calculationTypeEl.addEventListener('change', function() {
        updateFormulaDisplay();
        toggleSameElementsInput();
    });
}

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

// quizz
// Struktur data untuk kuis Permutasi dan Kombinasi
const quizData = [
    {
        question: "Berapa banyak cara menyusun 3 angka berbeda dari angka 1, 2, 3, 4, dan 5?",
        options: ["15", "60", "125", "120"],
        answer: "60",
        explanation: "Ini adalah soal Permutasi (P) karena urutan angka penting (misalnya 123 ≠ 321). \nTotal angka (n)=5. Angka yang diambil (r)=3. \nRumusnya: P(n,r) = n! / (n-r)!. \nP(5,3) = 5! / (5-3)! = 5! / 2! = 5 × 4 × 3 = 60.",
        topic: "Permutasi Dasar"
    },
    {
        question: "Dalam sebuah organisasi yang terdiri dari 7 anggota, akan dipilih 3 orang untuk menjadi Ketua, Sekretaris, dan Bendahara. Berapa banyak susunan kepengurusan yang mungkin?",
        options: ["210", "35", "5040", "42"],
        answer: "210",
        explanation: "Ini adalah soal Permutasi (P) karena urutan posisi (Ketua, Sekretaris, Bendahara) sangat penting. \nTotal anggota (n)=7. Posisi yang diisi (r)=3. \nRumusnya: P(7,3) = 7! / (7-3)! = 7! / 4! = 7 × 6 × 5 = 210.",
        topic: "Permutasi Posisi"
    },
    {
        question: "Dari 8 pelamar kerja yang memenuhi syarat, sebuah perusahaan akan memilih 3 orang untuk ditempatkan pada posisi yang sama (tidak ada perbedaan jabatan). Berapa banyak cara pemilihan yang mungkin?",
        options: ["336", "56", "24", "40320"],
        answer: "56",
        explanation: "Ini adalah soal Kombinasi (C) karena urutan pemilihan tidak penting (semua ditempatkan pada posisi yang sama). \nTotal pelamar (n)=8. Orang yang dipilih (r)=3. \nRumusnya: C(n,r) = n! / (r! * (n-r)!). \nC(8,3) = 8! / (3! * 5!) = (8 × 7 × 6) / (3 × 2 × 1) = 56.",
        topic: "Kombinasi Dasar"
    },
    {
        question: "Berapa banyak susunan kata berbeda yang dapat dibentuk dari kata 'MATEMATIKA'?",
        options: ["151.200", "1.512.000", "10!", "3.628.800"],
        answer: "151.200",
        explanation: "Ini adalah soal Permutasi dengan Unsur yang Sama. Total huruf (n)=10. \nHuruf yang berulang: M (2 kali), A (3 kali), T (2 kali). \nRumusnya: P = n! / (k1! * k2! * k3!...). \nP = 10! / (2! * 3! * 2!) = 3.628.800 / (2 * 6 * 2) = 3.628.800 / 24 = 151.200.",
        topic: "Permutasi Unsur Sama"
    },
    {
        question: "Sebuah kantong berisi 5 kelereng merah dan 4 kelereng biru. Jika diambil 2 kelereng merah dan 1 kelereng biru, berapa banyak cara pengambilannya?",
        options: ["30", "15", "60", "40"], 
        answer: "40",
        explanation: "Ini adalah soal Kombinasi ganda (aturan perkalian) karena urutan pengambilan tidak penting. \n1. Kombinasi 2 Merah dari 5: C(5,2) = 5! / (2! * 3!) = 10.\n2. Kombinasi 1 Biru dari 4: C(4,1) = 4! / (1! * 3!) = 4.\nTotal cara = C(5,2) × C(4,1) = 10 × 4 = 40.",
        topic: "Kombinasi Aturan Perkalian"
    }
];

// Durasi waktu per soal dalam detik
const TIME_PER_QUESTION = 30; 

// Variabel penting buat ngatur kuis
let currentQuestionIndex = 0; // Buat ngelacak kita lagi di soal ke berapa
let score = 0; // Total skor
let timer; // Variabel buat nyimpan ID timer
let timeLeft = TIME_PER_QUESTION; // Sisa waktu sekarang
let userAnswers = []; // Array buat nyimpan jawaban user & statusnya

// Ambil elemen HTML biar gampang dimanipulasi
const quizContainer = document.querySelector('.quiz-container');
const questionTextEl = document.getElementById('question-text');
const optionsAreaEl = document.getElementById('options-area');
const timerDisplayEl = document.getElementById('time-left');
const submitButton = document.getElementById('submit-answer-btn');
const feedbackEl = document.getElementById('feedback');
const resultsAreaEl = document.getElementById('results-area');
const scoreSummaryEl = document.getElementById('score-summary');
const reviewAreaEl = document.getElementById('review-area');
const questionNumberDisplayEl = document.getElementById('question-number-display');
const backgroundMusic = document.getElementById('background-music');

// VARIABEL BARU UNTUK START/RESET
const startScreenEl = document.getElementById('start-screen');
const startQuizBtn = document.getElementById('start-quiz-btn');
const clearAllBtn = document.getElementById('clear-all-btn'); 

// Fungsi buat nge-load soal yang sekarang
function loadQuestion() {
    // Berhenti dulu timer yang lagi jalan (kalo ada)
    clearInterval(timer); 
    timeLeft = TIME_PER_QUESTION; // Reset waktu
    
    // Sembunyikan hasil, tombol kirim & feedback
    feedbackEl.classList.remove('correct', 'incorrect');
    feedbackEl.textContent = '';
    submitButton.disabled = true; // Nonaktifin tombol biar gak bisa klik sebelum milih
    
    // Kalo semua soal udah kejawab, tampilin hasil akhir
    if (currentQuestionIndex >= quizData.length) {
        showResults();
        return;
    }

    const currentQ = quizData[currentQuestionIndex];
    
    // Update tampilan nomor soal
    questionNumberDisplayEl.textContent = `Soal ${currentQuestionIndex + 1} dari ${quizData.length}`;
    
    // Tampilkan teks soal
    questionTextEl.textContent = currentQ.question;
    
    // Reset pilihan jawaban
    optionsAreaEl.innerHTML = '';
    
    // Bikin elemen tombol (radio button) buat tiap pilihan jawaban
    currentQ.options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'quiz-option'; // Tambahkan class buat styling CSS
        
        // Bikin radio input
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz-option'; // Nama yang sama biar cuma bisa pilih 1
        input.value = option;
        
        // Aktifkan tombol kirim begitu user milih
        input.addEventListener('change', () => {
            submitButton.disabled = false;
        });

        // Masukkan input dan teks pilihan ke dalam label
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        optionsAreaEl.appendChild(label);
    });
    
    // Mulai timer baru
    startTimer();
}

// Fungsi buat ngitung mundur waktu
function startTimer() {
    timerDisplayEl.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplayEl.textContent = timeLeft;

        // Kalo waktu habis, otomatis submit jawaban kosong (atau jawaban yang udah dipilih)
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer(true); // true menandakan waktu habis
        }
    }, 1000); // Jalan setiap 1 detik
}

// Fungsi buat nge-check jawaban user
function submitAnswer(timeUp = false) {
    // Stop timer
    clearInterval(timer);

    // Nonaktifkan tombol kirim
    submitButton.disabled = true; 

    const currentQ = quizData[currentQuestionIndex];
    
    // Cari jawaban yang dipilih user
    const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
    const userAnswer = selectedOption ? selectedOption.value : null;

    let isCorrect = false;
    
    // Check jawaban
    if (userAnswer === currentQ.answer) {
        isCorrect = true;
        score++; // Tambah skor kalo bener
    }
    
    // Simpan hasil jawaban user buat ditampilkan di review
    userAnswers.push({
        question: currentQ.question,
        userAnswer: userAnswer || (timeUp ? "Waktu Habis" : "Tidak Dijawab"),
        correctAnswer: currentQ.answer,
        isCorrect: isCorrect,
        explanation: currentQ.explanation
    });

    // Berikan umpan balik instan
    showFeedback(isCorrect, timeUp, currentQ.answer);

    // Otomatis pindah ke soal berikutnya setelah beberapa detik
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(); // Panggil soal berikutnya
    }, 2000); // Tunggu 2 detik buat user liat feedback
}

// Fungsi buat nampilin bener/salah per soal
function showFeedback(isCorrect, timeUp, correctAnswer) {
    feedbackEl.classList.add('active');
    if (timeUp) {
        feedbackEl.textContent = `Waktu Habis! Jawaban yang benar adalah: ${correctAnswer}`;
        feedbackEl.classList.add('incorrect'); // Anggap habis waktu itu salah
    } else if (isCorrect) {
        feedbackEl.textContent = 'Bener, Pinter Banget!';
        feedbackEl.classList.add('correct');
    } else {
        feedbackEl.textContent = `Ups, Jawabannya: ${correctAnswer}`;
        feedbackEl.classList.add('incorrect');
    }
    // Nonaktifkan semua pilihan jawaban setelah submit/waktu habis
    document.querySelectorAll('input[name="quiz-option"]').forEach(input => input.disabled = true);
}

// Fungsi ini dipanggil saat tombol "Mulai Kuis" diklik
function startQuiz() {
    // Sembunyikan start screen
    startScreenEl.classList.add('hidden');
    
    // Tampilkan elemen kuis utama
    document.getElementById('timer-display').classList.remove('hidden');
    document.getElementById('question-area').classList.remove('hidden');
    document.querySelector('.quiz-controls').classList.remove('hidden');
    
    // Mulai dari soal pertama
    loadQuestion();
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(error => {
            console.log('Autoplay musik diblokir oleh browser:', error);
        });
    }
}

// Fungsi buat nampilin hasil akhir dan pembahasan
function showResults() {
    // Sembunyikan area soal
    document.getElementById('question-area').classList.add('hidden');
    document.querySelector('.quiz-controls').classList.add('hidden');
    document.getElementById('timer-display').classList.add('hidden'); // Sembunyikan timer
    
    // Tampilkan area hasil
    resultsAreaEl.classList.remove('hidden');

    // Tampilkan ringkasan skor
    scoreSummaryEl.innerHTML = `Anda menjawab ${score} dari ${quizData.length} soal dengan benar. Skor Anda: ${Math.round((score / quizData.length) * 100)}%`;

    // Tampilkan pembahasan dan langkah pengerjaan
    reviewAreaEl.innerHTML = '<h4>Langkah Pengerjaan dan Pembahasan:</h4>';
    userAnswers.forEach((result, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const status = result.isCorrect ? 'Benar' : 'Salah';
        const statusClass = result.isCorrect ? 'correct-text' : 'incorrect-text';

        reviewItem.innerHTML = `
            <h5>${index + 1}. ${result.question} <span class="${statusClass}">${status}</span></h5>
            <p>Jawaban Anda: ${result.userAnswer}</p>
            <p>Jawaban Benar: ${result.correctAnswer}</p>
            <p><strong>Pembahasan:</strong> ${result.explanation}</p>
        `;
        reviewAreaEl.appendChild(reviewItem);

        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    });

    // Tampilkan tombol Ulangi Kuis
    clearAllBtn.classList.remove('hidden'); 
}

// Fungsi buat mereset kuis dan kembali ke awal
function clearAll() {
    // Reset variabel
    currentQuestionIndex = 0; 
    score = 0;
    userAnswers = [];
    clearInterval(timer);
    timeLeft = TIME_PER_QUESTION;
    
    // Sembunyikan area hasil dan tombol reset
    resultsAreaEl.classList.add('hidden');
    clearAllBtn.classList.add('hidden');
    
    // Tampilkan kembali Start Screen
    startScreenEl.classList.remove('hidden');
    
    // Kosongkan feedback
    feedbackEl.textContent = '';
    feedbackEl.classList.remove('correct', 'incorrect');
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

// --- INI ADALAH STARTING POINT PROGRAM KUIS (Di-attach ke DOMContentLoaded) ---

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan ini dijalankan hanya di halaman kuis
    if (quizContainer) {
        // Kasih listener ke tombol 'Mulai Kuis'
        if (startQuizBtn) startQuizBtn.addEventListener('click', startQuiz); 

        // Kasih listener ke tombol 'Kirim Jawaban'
        if (submitButton) submitButton.addEventListener('click', () => submitAnswer());
        
        // Kasih listener ke tombol 'Ulangi Kuis'
        if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll); 
    }
    
    // Inisialisasi Kalkulator
    updateFormulaDisplay();
    updateHistoryDisplay();
});