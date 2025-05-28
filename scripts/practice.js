/**
 * 练习功能脚本
 * 处理各种练习模式
 */
document.addEventListener('DOMContentLoaded', function() {
    initializePracticePage();
});

/**
 * 初始化练习页面
 */
function initializePracticePage() {
    // 检查是否在练习页面
    if (!document.getElementById('practiceContainer')) return;
    
    // 初始化练习模式选择
    initializePracticeModes();
    
    // 初始化练习设置
    initializePracticeSettings();
    
    // 加载练习统计
    loadPracticeStats();
    
    // 设置事件监听器
    setupPracticeEventListeners();
}

/**
 * 初始化练习模式
 */
function initializePracticeModes() {
    const practiceModesContainer = document.getElementById('practiceModes');
    if (!practiceModesContainer) return;
    
    const modes = [
        {
            id: 'vocabulary-choice',
            title: '词汇选择',
            description: '从四个选项中选择正确的词汇含义',
            icon: '📝',
            difficulty: 'easy'
        },
        {
            id: 'meaning-choice',
            title: '含义选择',
            description: '根据词汇含义选择正确的单词',
            icon: '🔤',
            difficulty: 'medium'
        },
        {
            id: 'spelling-practice',
            title: '拼写练习',
            description: '根据发音和含义拼写单词',
            icon: '✍️',
            difficulty: 'hard'
        },
        {
            id: 'listening-practice',
            title: '听力练习',
            description: '听发音选择正确的单词',
            icon: '🎧',
            difficulty: 'medium'
        },
        {
            id: 'rapid-fire',
            title: '快速问答',
            description: '限时快速回答词汇问题',
            icon: '⚡',
            difficulty: 'hard'
        },
        {
            id: 'review-mode',
            title: '复习模式',
            description: '复习已标记的重点词汇',
            icon: '📚',
            difficulty: 'easy'
        }
    ];
    
    practiceModesContainer.innerHTML = '';
    
    modes.forEach(mode => {
        const modeCard = createPracticeModeCard(mode);
        practiceModesContainer.appendChild(modeCard);
    });
}

/**
 * 创建练习模式卡片
 * @param {Object} mode - 练习模式数据
 * @returns {HTMLElement} - 练习模式卡片
 */
function createPracticeModeCard(mode) {
    const card = document.createElement('div');
    card.className = 'practice-mode-card';
    card.dataset.mode = mode.id;
    
    card.innerHTML = `
        <div class="mode-icon">${mode.icon}</div>
        <h3 class="mode-title">${mode.title}</h3>
        <p class="mode-description">${mode.description}</p>
        <div class="mode-footer">
            <span class="difficulty-badge ${mode.difficulty}">${getDifficultyText(mode.difficulty)}</span>
            <button class="btn btn-primary" onclick="startPractice('${mode.id}')">开始练习</button>
        </div>
    `;
    
    return card;
}

/**
 * 获取难度文本
 * @param {string} difficulty - 难度级别
 * @returns {string} - 难度文本
 */
function getDifficultyText(difficulty) {
    const difficultyMap = {
        'easy': '简单',
        'medium': '中等',
        'hard': '困难'
    };
    return difficultyMap[difficulty] || '未知';
}

/**
 * 开始练习
 * @param {string} mode - 练习模式
 */
function startPractice(mode) {
    const practiceContainer = document.getElementById('practiceContainer');
    if (!practiceContainer) return;
    
    // 隐藏模式选择界面
    const modesContainer = document.getElementById('practiceModes');
    const settingsContainer = document.getElementById('practiceSettings');
    
    if (modesContainer) modesContainer.style.display = 'none';
    if (settingsContainer) settingsContainer.style.display = 'none';
    
    // 显示练习界面
    const practiceInterface = document.getElementById('practiceInterface');
    if (practiceInterface) {
        practiceInterface.style.display = 'block';
    } else {
        // 创建练习界面
        createPracticeInterface(mode);
    }
    
    // 初始化具体的练习模式
    switch (mode) {
        case 'vocabulary-choice':
            initVocabularyChoice();
            break;
        case 'meaning-choice':
            initMeaningChoice();
            break;
        case 'spelling-practice':
            initSpellingPractice();
            break;
        case 'listening-practice':
            initListeningPractice();
            break;
        case 'rapid-fire':
            initRapidFire();
            break;
        case 'review-mode':
            initReviewMode();
            break;
        default:
            console.error('Unknown practice mode:', mode);
    }
}

/**
 * 创建练习界面
 * @param {string} mode - 练习模式
 */
function createPracticeInterface(mode) {
    const practiceContainer = document.getElementById('practiceContainer');
    
    const interfaceHTML = `
        <div id="practiceInterface" class="practice-interface">
            <div class="practice-header">
                <button class="btn btn-secondary" onclick="exitPractice()">退出练习</button>
                <div class="practice-progress">
                    <div class="progress-info">
                        <span id="currentQuestion">1</span> / <span id="totalQuestions">10</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
                <div class="practice-score">
                    得分: <span id="practiceScore">0</span>
                </div>
            </div>
            
            <div class="practice-content" id="practiceContent">
                <!-- 练习内容将在这里动态生成 -->
            </div>
            
            <div class="practice-controls">
                <button class="btn btn-secondary" id="skipButton" onclick="skipQuestion()">跳过</button>
                <button class="btn btn-primary" id="nextButton" onclick="nextQuestion()" style="display: none;">下一题</button>
            </div>
            
            <div class="practice-stats-mini">
                <div class="stat-item">
                    <span class="stat-label">正确率</span>
                    <span class="stat-value" id="miniAccuracy">0%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">连续正确</span>
                    <span class="stat-value" id="miniStreak">0</span>
                </div>
            </div>
        </div>
    `;
    
    practiceContainer.insertAdjacentHTML('beforeend', interfaceHTML);
}

/**
 * 初始化词汇选择练习
 */
function initVocabularyChoice() {
    if (!vocabularyManager || !vocabularyManager.isInitialized) {
        showNotification('词汇数据未加载完成', 'error');
        return;
    }
    
    // 获取练习设置
    const settings = getPracticeSettings();
    
    // 初始化练习状态
    window.currentPractice = {
        mode: 'vocabulary-choice',
        currentQuestion: 0,
        totalQuestions: settings.questionCount,
        score: 0,
        streak: 0,
        questions: generateVocabularyChoiceQuestions(settings)
    };
    
    // 显示第一题
    showVocabularyChoiceQuestion();
}

/**
 * 生成词汇选择题目
 * @param {Object} settings - 练习设置
 * @returns {Array} - 题目数组
 */
function generateVocabularyChoiceQuestions(settings) {
    const questions = [];
    const wordLevel = settings.level || 'basic';
    const wordPool = vocabularyManager.getWordsByLevel(wordLevel, 100, 0);
    
    if (wordPool.length < 4) {
        showNotification('词汇数据不足，无法生成题目', 'error');
        return [];
    }
    
    for (let i = 0; i < settings.questionCount; i++) {
        // 随机选择一个词作为问题
        const correctWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        
        // 生成错误选项
        const wrongOptions = [];
        while (wrongOptions.length < 3) {
            const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
            if (randomWord.word !== correctWord.word && 
                !wrongOptions.some(w => w.word === randomWord.word)) {
                wrongOptions.push(randomWord);
            }
        }
        
        // 创建选项数组并打乱
        const options = [correctWord, ...wrongOptions];
        shuffleArray(options);
        
        questions.push({
            question: correctWord.word,
            correctAnswer: correctWord.meaning,
            options: options.map(opt => opt.meaning),
            correctIndex: options.findIndex(opt => opt.word === correctWord.word),
            wordData: correctWord
        });
    }
    
    return questions;
}

/**
 * 显示词汇选择题目
 */
function showVocabularyChoiceQuestion() {
    const practice = window.currentPractice;
    if (!practice || practice.currentQuestion >= practice.questions.length) {
        finishPractice();
        return;
    }
    
    const question = practice.questions[practice.currentQuestion];
    const practiceContent = document.getElementById('practiceContent');
    
    practiceContent.innerHTML = `
        <div class="question-container">
            <div class="question-type">选择正确含义</div>
            <div class="question-word">
                ${question.question}
                <button class="pronunciation-btn" onclick="pronounceWord('${question.question}')">🔊</button>
            </div>
            ${question.wordData.phonetic ? `<div class="question-phonetic">${question.wordData.phonetic}</div>` : ''}
        </div>
        
        <div class="options-container">
            ${question.options.map((option, index) => `
                <button class="option-btn" onclick="selectVocabularyAnswer(${index})" data-index="${index}">
                    ${option}
                </button>
            `).join('')}
        </div>
        
        <div class="answer-feedback" id="answerFeedback"></div>
    `;
    
    // 更新进度
    updatePracticeProgress();
}

/**
 * 选择词汇答案
 * @param {number} selectedIndex - 选择的选项索引
 */
function selectVocabularyAnswer(selectedIndex) {
    const practice = window.currentPractice;
    const question = practice.questions[practice.currentQuestion];
    
    // 禁用所有选项
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);
    
    const isCorrect = selectedIndex === question.correctIndex;
    
    // 标记正确和错误答案
    optionButtons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
        optionButtons[question.correctIndex].classList.add('correct');
    }
    
    // 显示反馈
    const feedback = document.getElementById('answerFeedback');
    if (isCorrect) {
        practice.score += 10;
        practice.streak += 1;
        feedback.innerHTML = `
            <div class="feedback-correct">
                <strong>正确！</strong>
                <p>${question.wordData.example || ''}</p>
            </div>
        `;
    } else {
        practice.streak = 0;
        feedback.innerHTML = `
            <div class="feedback-incorrect">
                <strong>错误！</strong>
                <p>正确答案是: ${question.correctAnswer}</p>
                <p>${question.wordData.example || ''}</p>
            </div>
        `;
    }
    
    // 更新统计
    updateMiniStats();
    
    // 显示下一题按钮
    const nextButton = document.getElementById('nextButton');
    const skipButton = document.getElementById('skipButton');
    if (nextButton) nextButton.style.display = 'block';
    if (skipButton) skipButton.style.display = 'none';
}

/**
 * 下一题
 */
function nextQuestion() {
    const practice = window.currentPractice;
    practice.currentQuestion += 1;
    
    // 隐藏下一题按钮，显示跳过按钮
    const nextButton = document.getElementById('nextButton');
    const skipButton = document.getElementById('skipButton');
    if (nextButton) nextButton.style.display = 'none';
    if (skipButton) skipButton.style.display = 'block';
    
    // 根据练习模式显示下一题
    switch (practice.mode) {
        case 'vocabulary-choice':
            showVocabularyChoiceQuestion();
            break;
        case 'meaning-choice':
            showMeaningChoiceQuestion();
            break;
        case 'spelling-practice':
            showSpellingQuestion();
            break;
        case 'listening-practice':
            showListeningQuestion();
            break;
        case 'rapid-fire':
            showRapidFireQuestion();
            break;
        case 'review-mode':
            showReviewQuestion();
            break;
    }
}

/**
 * 跳过题目
 */
function skipQuestion() {
    const practice = window.currentPractice;
    practice.streak = 0;
    nextQuestion();
}

/**
 * 更新练习进度
 */
function updatePracticeProgress() {
    const practice = window.currentPractice;
    if (!practice) return;
    
    const currentQuestionEl = document.getElementById('currentQuestion');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const progressFill = document.getElementById('progressFill');
    const practiceScore = document.getElementById('practiceScore');
    
    if (currentQuestionEl) currentQuestionEl.textContent = practice.currentQuestion + 1;
    if (totalQuestionsEl) totalQuestionsEl.textContent = practice.totalQuestions;
    if (practiceScore) practiceScore.textContent = practice.score;
    
    if (progressFill) {
        const progress = ((practice.currentQuestion + 1) / practice.totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

/**
 * 更新迷你统计
 */
function updateMiniStats() {
    const practice = window.currentPractice;
    if (!practice) return;
    
    const miniAccuracy = document.getElementById('miniAccuracy');
    const miniStreak = document.getElementById('miniStreak');
    
    if (miniAccuracy) {
        const totalAnswered = practice.currentQuestion + 1;
        const correctAnswers = Math.floor(practice.score / 10);
        const accuracy = Math.round((correctAnswers / totalAnswered) * 100);
        miniAccuracy.textContent = `${accuracy}%`;
    }
    
    if (miniStreak) {
        miniStreak.textContent = practice.streak;
    }
}

/**
 * 完成练习
 */
function finishPractice() {
    const practice = window.currentPractice;
    if (!practice) return;
    
    const practiceContent = document.getElementById('practiceContent');
    const totalAnswered = practice.totalQuestions;
    const correctAnswers = Math.floor(practice.score / 10);
    const accuracy = Math.round((correctAnswers / totalAnswered) * 100);
    
    practiceContent.innerHTML = `
        <div class="practice-complete">
            <div class="completion-icon">${accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👏' : '💪'}</div>
            <h2>练习完成！</h2>
            
            <div class="final-stats">
                <div class="stat-row">
                    <span class="stat-label">总题数:</span>
                    <span class="stat-value">${totalAnswered}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">正确数:</span>
                    <span class="stat-value">${correctAnswers}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">正确率:</span>
                    <span class="stat-value">${accuracy}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">最终得分:</span>
                    <span class="stat-value">${practice.score}</span>
                </div>
            </div>
            
            <div class="completion-message">
                ${getCompletionMessage(accuracy)}
            </div>
            
            <div class="completion-actions">
                <button class="btn btn-primary" onclick="startPractice('${practice.mode}')">再练一次</button>
                <button class="btn btn-secondary" onclick="exitPractice()">返回选择</button>
            </div>
        </div>
    `;
    
    // 隐藏控制按钮
    const nextButton = document.getElementById('nextButton');
    const skipButton = document.getElementById('skipButton');
    if (nextButton) nextButton.style.display = 'none';
    if (skipButton) skipButton.style.display = 'none';
    
    // 保存练习记录
    savePracticeResult(practice.mode, correctAnswers, totalAnswered, practice.score);
}

/**
 * 获取完成消息
 * @param {number} accuracy - 正确率
 * @returns {string} - 完成消息
 */
function getCompletionMessage(accuracy) {
    if (accuracy >= 90) {
        return '太棒了！你的表现非常出色！';
    } else if (accuracy >= 80) {
        return '很好！继续保持这个水平！';
    } else if (accuracy >= 60) {
        return '不错！还有提升空间，继续努力！';
    } else {
        return '需要多加练习，相信你能做得更好！';
    }
}

/**
 * 退出练习
 */
function exitPractice() {
    const practiceInterface = document.getElementById('practiceInterface');
    const modesContainer = document.getElementById('practiceModes');
    const settingsContainer = document.getElementById('practiceSettings');
    
    if (practiceInterface) practiceInterface.style.display = 'none';
    if (modesContainer) modesContainer.style.display = 'block';
    if (settingsContainer) settingsContainer.style.display = 'block';
    
    // 清除练习状态
    window.currentPractice = null;
}

/**
 * 初始化练习设置
 */
function initializePracticeSettings() {
    const settingsContainer = document.getElementById('practiceSettings');
    if (!settingsContainer) return;
    
    settingsContainer.innerHTML = `
        <div class="settings-card">
            <h3>练习设置</h3>
            
            <div class="setting-group">
                <label for="questionCount">题目数量:</label>
                <select id="questionCount">
                    <option value="5">5题</option>
                    <option value="10" selected>10题</option>
                    <option value="15">15题</option>
                    <option value="20">20题</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label for="practiceLevel">词汇级别:</label>
                <select id="practiceLevel">
                    <option value="basic" selected>基础</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label for="timeLimit">时间限制:</label>
                <select id="timeLimit">
                    <option value="0" selected>无限制</option>
                    <option value="30">30秒/题</option>
                    <option value="60">60秒/题</option>
                    <option value="120">2分钟/题</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="includeReview">
                    <span class="checkmark"></span>
                    包含复习词汇
                </label>
            </div>
        </div>
    `;
}

/**
 * 获取练习设置
 * @returns {Object} - 练习设置对象
 */
function getPracticeSettings() {
    const questionCount = parseInt(document.getElementById('questionCount')?.value) || 10;
    const level = document.getElementById('practiceLevel')?.value || 'basic';
    const timeLimit = parseInt(document.getElementById('timeLimit')?.value) || 0;
    const includeReview = document.getElementById('includeReview')?.checked || false;
    
    return {
        questionCount,
        level,
        timeLimit,
        includeReview
    };
}

/**
 * 保存练习结果
 * @param {string} mode - 练习模式
 * @param {number} correct - 正确数
 * @param {number} total - 总数
 * @param {number} score - 得分
 */
function savePracticeResult(mode, correct, total, score) {
    try {
        const result = {
            mode,
            correct,
            total,
            score,
            accuracy: Math.round((correct / total) * 100),
            date: new Date().toISOString()
        };
        
        let practiceHistory = JSON.parse(localStorage.getItem('practiceHistory')) || [];
        practiceHistory.push(result);
        
        // 只保留最近100次记录
        if (practiceHistory.length > 100) {
            practiceHistory = practiceHistory.slice(-100);
        }
        
        localStorage.setItem('practiceHistory', JSON.stringify(practiceHistory));
        
        // 更新总体统计
        updateOverallStats(correct, total, score);
        
    } catch (error) {
        console.error('Error saving practice result:', error);
    }
}

/**
 * 更新总体统计
 * @param {number} correct - 正确数
 * @param {number} total - 总数
 * @param {number} score - 得分
 */
function updateOverallStats(correct, total, score) {
    try {
        let stats = JSON.parse(localStorage.getItem('practiceStats')) || {
            total: 0,
            correct: 0,
            totalScore: 0,
            streak: 0,
            maxStreak: 0,
            sessionsCompleted: 0
        };
        
        stats.total += total;
        stats.correct += correct;
        stats.totalScore += score;
        stats.sessionsCompleted += 1;
        
        // 更新连击记录
        if (correct === total) {
            stats.streak += 1;
            if (stats.streak > stats.maxStreak) {
                stats.maxStreak = stats.streak;
            }
        } else {
            stats.streak = 0;
        }
        
        localStorage.setItem('practiceStats', JSON.stringify(stats));
        
    } catch (error) {
        console.error('Error updating overall stats:', error);
    }
}

/**
 * 加载练习统计
 */
function loadPracticeStats() {
    const statsContainer = document.getElementById('practiceStatsContainer');
    if (!statsContainer) return;
    
    try {
        const stats = JSON.parse(localStorage.getItem('practiceStats')) || {
            total: 0,
            correct: 0,
            totalScore: 0,
            streak: 0,
            maxStreak: 0,
            sessionsCompleted: 0
        };
        
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-info">
                        <div class="stat-value">${accuracy}%</div>
                        <div class="stat-label">总正确率</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.correct}</div>
                        <div class="stat-label">答对题数</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.maxStreak}</div>
                        <div class="stat-label">最高连击</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-info">
                        <div class="stat-value">${stats.sessionsCompleted}</div>
                        <div class="stat-label">完成练习</div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading practice stats:', error);
        statsContainer.innerHTML = '<p>无法加载统计数据</p>';
    }
}

/**
 * 设置练习事件监听器
 */
function setupPracticeEventListeners() {
    // 设置变化监听
    const settingsElements = document.querySelectorAll('#practiceSettings select, #practiceSettings input');
    settingsElements.forEach(element => {
        element.addEventListener('change', function() {
            // 可以在这里添加设置变化的处理逻辑
            console.log('Practice settings changed');
        });
    });
}

// 导出函数到全局作用域
window.startPractice = startPractice;
window.selectVocabularyAnswer = selectVocabularyAnswer;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.exitPractice = exitPractice;

// 其他练习模式的占位符函数
function initMeaningChoice() {
    console.log('Meaning choice practice not implemented yet');
    showNotification('该功能正在开发中', 'info');
}

function initSpellingPractice() {
    // 练习设置
    const settings = getPracticeSettings ? getPracticeSettings() : { level: 'basic', questionCount: 10 };
    const wordLevel = settings.level || 'basic';
    const questionCount = settings.questionCount || 10;
    
    // 获取题库
    const wordPool = vocabularyManager.getWordsByLevel(wordLevel, 100, 0);
    if (!wordPool || wordPool.length < 1) {
        showNotification('词汇数据不足，无法生成题目', 'error');
        return;
    }
    // 随机抽取题目
    const questions = [];
    const usedIndexes = new Set();
    while (questions.length < questionCount && usedIndexes.size < wordPool.length) {
        const idx = Math.floor(Math.random() * wordPool.length);
        if (!usedIndexes.has(idx)) {
            usedIndexes.add(idx);
            const wordObj = wordPool[idx];
            questions.push({
                word: wordObj.word,
                meaning: wordObj.meaning,
                phonetic: wordObj.phonetic || '',
                example: wordObj.example || '',
                audio: wordObj.audio || '',
            });
        }
    }
    if (questions.length === 0) {
        showNotification('题目生成失败', 'error');
        return;
    }
    // 初始化状态
    window.spellingPractice = {
        questions,
        current: 0,
        correct: 0,
        total: questions.length,
        streak: 0,
        score: 0,
        userAnswers: [],
        finished: false
    };
    // UI初始化
    document.getElementById('practiceTitle').textContent = '✍️ 拼写练习';
    document.getElementById('practiceArea').classList.add('active');
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('skipBtn').style.display = 'block';
    showSpellingQuestion();
    updateSpellingProgress();
    // 绑定按钮
    document.getElementById('nextBtn').onclick = submitSpellingAnswer;
    document.getElementById('skipBtn').onclick = skipSpellingQuestion;
}

function showSpellingQuestion() {
    const state = window.spellingPractice;
    const q = state.questions[state.current];
    const container = document.getElementById('questionContainer');
    if (!q) {
        container.innerHTML = '<div style="text-align:center;color:#ef4444;padding:2rem;">题目加载失败</div>';
        return;
    }
    // 题干：释义+音标+例句+发音按钮
    let html = `<div class="question-text">请根据释义和发音拼写出正确的英文单词</div>`;
    html += `<div class="hint-section"><div class="hint-text">释义：${q.meaning || '无'}<br>`;
    if (q.phonetic) html += `音标：<b>[${q.phonetic}]</b><br>`;
    if (q.example) html += `例句：${q.example}<br>`;
    html += `</div></div>`;
    html += `<div style="text-align:center;margin:1rem 0;">
        <button class="btn btn-secondary" onclick="playSpellingAudio()">🔊 听发音</button>
    </div>`;
    html += `<div class="typing-area">
        <input type="text" id="spellingInput" class="typing-input" placeholder="请输入英文单词" autocomplete="off" autofocus />
    </div>`;
    html += `<div id="spellingFeedback" style="text-align:center;margin-top:1rem;"></div>`;
    container.innerHTML = html;
    // 回车提交
    const input = document.getElementById('spellingInput');
    input.focus();
    input.onkeydown = function(e) {
        if (e.key === 'Enter') submitSpellingAnswer();
    };
    // 允许多次点击发音
    window.playSpellingAudio = function() {
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(q.word);
            utter.lang = 'en-US';
            utter.rate = 0.8;
            speechSynthesis.speak(utter);
        }
    };
}

function submitSpellingAnswer() {
    const state = window.spellingPractice;
    if (state.finished) return;
    const input = document.getElementById('spellingInput');
    const feedback = document.getElementById('spellingFeedback');
    if (!input) return;
    const userAnswer = input.value.trim();
    const correctWord = state.questions[state.current].word;
    let isCorrect = false;
    if (userAnswer.toLowerCase() === correctWord.toLowerCase()) {
        isCorrect = true;
        state.correct++;
        state.streak++;
        state.score += 10;
        feedback.innerHTML = `<span style='color:#10b981;font-weight:bold;'>✔️ 正确！</span>`;
    } else {
        state.streak = 0;
        feedback.innerHTML = `<span style='color:#ef4444;font-weight:bold;'>❌ 错误，正确答案：${correctWord}</span>`;
    }
    state.userAnswers.push({
        word: correctWord,
        user: userAnswer,
        correct: isCorrect
    });
    input.disabled = true;
    // 下一题按钮变为"下一题"或"完成"
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = (state.current === state.total - 1) ? '完成' : '下一题';
    nextBtn.onclick = nextSpellingQuestion;
    updateSpellingProgress();
}

function nextSpellingQuestion() {
    const state = window.spellingPractice;
    if (state.current < state.total - 1) {
        state.current++;
        showSpellingQuestion();
        updateSpellingProgress();
        // 恢复按钮
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.textContent = '提交';
        nextBtn.onclick = submitSpellingAnswer;
    } else {
        finishSpellingPractice();
    }
}

function skipSpellingQuestion() {
    const state = window.spellingPractice;
    if (state.finished) return;
    state.userAnswers.push({
        word: state.questions[state.current].word,
        user: '',
        correct: false,
        skipped: true
    });
    state.streak = 0;
    // 直接进入下一题
    if (state.current < state.total - 1) {
        state.current++;
        showSpellingQuestion();
        updateSpellingProgress();
        // 恢复按钮
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.textContent = '提交';
        nextBtn.onclick = submitSpellingAnswer;
    } else {
        finishSpellingPractice();
    }
}

function updateSpellingProgress() {
    const state = window.spellingPractice;
    document.getElementById('currentScore').textContent = state.score;
    document.getElementById('currentStreak').textContent = state.streak;
    document.getElementById('progressText').textContent = `第 ${state.current + 1} / ${state.total} 题`;
    const percent = Math.round(((state.current + 1) / state.total) * 100);
    document.getElementById('progressFill').style.width = percent + '%';
}

function finishSpellingPractice() {
    const state = window.spellingPractice;
    state.finished = true;
    // 展示结果
    const correct = state.correct;
    const total = state.total;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    // 保存结果
    savePracticeResult('spelling-practice', correct, total, state.score);
    // 显示模态框
    const modal = document.getElementById('resultModal');
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const stats = document.getElementById('resultStats');
    if (modal) {
        icon.textContent = accuracy >= 80 ? '🎉' : (accuracy >= 60 ? '👍' : '💪');
        title.textContent = `拼写练习完成！`;
        stats.innerHTML = `
            <div>总题数：${total}</div>
            <div>答对：${correct}</div>
            <div>正确率：${accuracy}%</div>
        `;
        modal.style.display = 'flex';
    }
    // 关闭按钮
    document.getElementById('resultCloseBtn').onclick = function() {
        modal.style.display = 'none';
        exitPractice();
    };
    document.getElementById('resultRetryBtn').onclick = function() {
        modal.style.display = 'none';
        initSpellingPractice();
    };
}

function initListeningPractice() {
    console.log('Listening practice not implemented yet');
    showNotification('该功能正在开发中', 'info');
}

function initRapidFire() {
    console.log('Rapid fire practice not implemented yet');
    showNotification('该功能正在开发中', 'info');
}

function initReviewMode() {
    // 获取复习词汇
    const reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
    if (!reviewWords.length) {
        showNotification('没有需要复习的词汇，请先在词汇页面添加重点词', 'info');
        return;
    }
    // 生成题目（可扩展为 quiz/spelling 等多模式，这里先做闪卡模式）
    const questions = reviewWords.map(word => {
        const wordData = vocabularyManager.getLocalWordData(word) || { word };
        return {
            word: wordData.word,
            meaning: wordData.meaning || '',
            phonetic: wordData.phonetic || '',
            example: wordData.example || ''
        };
    });
    window.reviewPractice = {
        questions,
        current: 0,
        total: questions.length,
        known: 0,
        unsure: 0,
        unknown: 0,
        userAnswers: [],
        finished: false
    };
    document.getElementById('practiceTitle').textContent = '📚 复习模式';
    document.getElementById('practiceArea').classList.add('active');
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('skipBtn').style.display = 'block';
    showReviewQuestion();
    // 绑定按钮
    document.getElementById('nextBtn').onclick = () => markReviewAnswer('known');
    document.getElementById('skipBtn').onclick = () => markReviewAnswer('unknown');
}

function showReviewQuestion() {
    const state = window.reviewPractice;
    const q = state.questions[state.current];
    const container = document.getElementById('questionContainer');
    if (!q) {
        container.innerHTML = '<div style="text-align:center;color:#ef4444;padding:2rem;">题目加载失败</div>';
        return;
    }
    let html = `<div class="question-text">请回忆下列单词的含义和用法</div>`;
    html += `<div class="question-word">${q.word}</div>`;
    if (q.phonetic) html += `<div class="question-phonetic">[${q.phonetic}]</div>`;
    html += `<div class="review-actions" style="margin:2rem 0;display:flex;gap:1rem;justify-content:center;">
        <button class="btn btn-success" onclick="markReviewAnswer('known')">已掌握</button>
        <button class="btn btn-warning" onclick="markReviewAnswer('unsure')">不确定</button>
        <button class="btn btn-danger" onclick="markReviewAnswer('unknown')">不认识</button>
        <button class="btn btn-secondary" onclick="playReviewAudio()">🔊 听发音</button>
        <button class="btn btn-info" onclick="showReviewAnswer()">显示释义</button>
    </div>`;
    html += `<div id="reviewAnswer" style="text-align:center;margin-top:1rem;display:none;"></div>`;
    container.innerHTML = html;
    window.playReviewAudio = function() {
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(q.word);
            utter.lang = 'en-US';
            utter.rate = 0.8;
            speechSynthesis.speak(utter);
        }
    };
    window.showReviewAnswer = function() {
        const ans = document.getElementById('reviewAnswer');
        ans.style.display = 'block';
        ans.innerHTML = `<div class='hint-section'><div class='hint-text'>释义：${q.meaning || '无'}<br>${q.example ? '例句：' + q.example : ''}</div></div>`;
    };
}

function markReviewAnswer(type) {
    const state = window.reviewPractice;
    const q = state.questions[state.current];
    state.userAnswers.push({ word: q.word, result: type });
    if (type === 'known') state.known++;
    if (type === 'unsure') state.unsure++;
    if (type === 'unknown') state.unknown++;
    if (state.current < state.total - 1) {
        state.current++;
        showReviewQuestion();
    } else {
        finishReviewPractice();
    }
}

function finishReviewPractice() {
    const state = window.reviewPractice;
    state.finished = true;
    // 展示结果
    const { known, unsure, unknown, total } = state;
    const accuracy = total > 0 ? Math.round((known / total) * 100) : 0;
    // 保存结果
    savePracticeResult('review-mode', known, total, known * 10);
    // 显示模态框
    const modal = document.getElementById('resultModal');
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');
    const stats = document.getElementById('resultStats');
    if (modal) {
        icon.textContent = accuracy >= 80 ? '🎉' : (accuracy >= 60 ? '👍' : '💪');
        title.textContent = `复习完成！`;
        stats.innerHTML = `
            <div>总词数：${total}</div>
            <div>已掌握：${known}</div>
            <div>不确定：${unsure}</div>
            <div>不认识：${unknown}</div>
            <div>掌握率：${accuracy}%</div>
        `;
        modal.style.display = 'flex';
    }
    // 关闭按钮
    document.getElementById('resultCloseBtn').onclick = function() {
        modal.style.display = 'none';
        exitPractice();
    };
    document.getElementById('resultRetryBtn').onclick = function() {
        modal.style.display = 'none';
        initReviewMode();
    };
}

function showMeaningChoiceQuestion() {
    console.log('Meaning choice question not implemented yet');
}

function showListeningQuestion() {
    console.log('Listening question not implemented yet');
}

function showRapidFireQuestion() {
    console.log('Rapid fire question not implemented yet');
}