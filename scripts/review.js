/**
 * 复习功能脚本
 * 处理词汇复习和记忆管理
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeReviewPage();
});

/**
 * 初始化复习页面
 */
function initializeReviewPage() {
    // 检查是否在复习页面
    if (!document.getElementById('reviewContainer')) return;
    
    // 加载复习词汇
    loadReviewWords();
    
    // 初始化复习模式
    initializeReviewModes();
    
    // 设置事件监听器
    setupReviewEventListeners();
    
    // 加载复习统计
    loadReviewStats();
}

/**
 * 加载复习词汇
 */
function loadReviewWords() {
    const reviewWordsContainer = document.getElementById('reviewWordsContainer');
    if (!reviewWordsContainer) return;
    
    try {
        const reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        
        if (reviewWords.length === 0) {
            reviewWordsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>暂无复习词汇</h3>
                    <p>在学习过程中将重要词汇添加到复习列表</p>
                    <a href="search.html" class="btn btn-primary">去添加词汇</a>
                </div>
            `;
            return;
        }
        
        // 获取词汇详细信息
        const reviewWordDetails = [];
        reviewWords.forEach(word => {
            const wordData = vocabularyManager.getWordByText(word);
            if (wordData) {
                reviewWordDetails.push({
                    ...wordData,
                    reviewCount: getWordReviewCount(word),
                    lastReviewed: getWordLastReviewed(word),
                    difficulty: getWordDifficulty(word)
                });
            }
        });
        
        // 按优先级排序（难度高、复习次数少、时间久的优先）
        reviewWordDetails.sort((a, b) => {
            const priorityA = calculateReviewPriority(a);
            const priorityB = calculateReviewPriority(b);
            return priorityB - priorityA;
        });
        
        // 显示复习词汇
        displayReviewWords(reviewWordDetails);
        
    } catch (error) {
        console.error('Error loading review words:', error);
        reviewWordsContainer.innerHTML = '<p>加载复习词汇时出错</p>';
    }
}

/**
 * 显示复习词汇
 * @param {Array} words - 复习词汇数组
 */
function displayReviewWords(words) {
    const reviewWordsContainer = document.getElementById('reviewWordsContainer');
    
    const wordsHTML = words.map(word => {
        const priorityClass = getPriorityClass(calculateReviewPriority(word));
        const difficultyText = getDifficultyText(word.difficulty);
        
        return `
            <div class="review-word-card ${priorityClass}" data-word="${word.word}">
                <div class="word-header">
                    <div class="word-main">
                        <span class="word-text">${word.word}</span>
                        <button class="pronunciation-btn" onclick="pronounceWord('${word.word}')">🔊</button>
                    </div>
                    <div class="word-badges">
                        <span class="priority-badge ${priorityClass}">
                            ${getPriorityText(calculateReviewPriority(word))}
                        </span>
                        <span class="difficulty-badge ${word.difficulty}">
                            ${difficultyText}
                        </span>
                    </div>
                </div>
                
                <div class="word-phonetic">${word.phonetic || ''}</div>
                <div class="word-meaning">${word.meaning || ''}</div>
                
                <div class="review-info">
                    <div class="review-stat">
                        <span class="stat-label">复习次数:</span>
                        <span class="stat-value">${word.reviewCount}</span>
                    </div>
                    <div class="review-stat">
                        <span class="stat-label">上次复习:</span>
                        <span class="stat-value">${formatLastReviewed(word.lastReviewed)}</span>
                    </div>
                </div>
                
                <div class="word-actions">
                    <button class="btn-small btn-success" onclick="markAsReviewed('${word.word}', this)">
                        已复习
                    </button>
                    <button class="btn-small btn-warning" onclick="markAsDifficult('${word.word}', this)">
                        标记困难
                    </button>
                    <button class="btn-small btn-danger" onclick="removeFromReview('${word.word}', this)">
                        移出复习
                    </button>
                    <button class="btn-small" onclick="showWordDetails('${word.word}')">
                        详情
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    reviewWordsContainer.innerHTML = `
        <div class="review-words-header">
            <h3>复习词汇 (${words.length})</h3>
            <div class="review-actions">
                <button class="btn btn-primary" onclick="startReviewSession()">开始复习</button>
                <button class="btn btn-secondary" onclick="clearAllReviewed()">清除已掌握</button>
            </div>
        </div>
        <div class="review-words-grid">
            ${wordsHTML}
        </div>
    `;
}

/**
 * 计算复习优先级
 * @param {Object} word - 词汇对象
 * @returns {number} - 优先级分数
 */
function calculateReviewPriority(word) {
    let priority = 0;
    
    // 难度权重 (0-30分)
    const difficultyWeight = {
        'easy': 10,
        'medium': 20,
        'hard': 30
    };
    priority += difficultyWeight[word.difficulty] || 15;
    
    // 复习次数权重 (0-25分，次数越少分数越高)
    const reviewCount = word.reviewCount || 0;
    priority += Math.max(0, 25 - reviewCount * 5);
    
    // 时间权重 (0-25分，时间越久分数越高)
    const lastReviewed = word.lastReviewed;
    if (lastReviewed) {
        const daysSinceReview = (Date.now() - new Date(lastReviewed).getTime()) / (1000 * 60 * 60 * 24);
        priority += Math.min(25, daysSinceReview * 2);
    } else {
        priority += 25; // 从未复习过
    }
    
    // 词汇频率权重 (0-20分，频率越低分数越高)
    const frequency = word.frequency || 0;
    priority += Math.max(0, 20 - frequency / 500);
    
    return Math.round(priority);
}

/**
 * 获取优先级类名
 * @param {number} priority - 优先级分数
 * @returns {string} - 类名
 */
function getPriorityClass(priority) {
    if (priority >= 70) return 'high-priority';
    if (priority >= 50) return 'medium-priority';
    return 'low-priority';
}

/**
 * 获取优先级文本
 * @param {number} priority - 优先级分数
 * @returns {string} - 优先级文本
 */
function getPriorityText(priority) {
    if (priority >= 70) return '高优先级';
    if (priority >= 50) return '中优先级';
    return '低优先级';
}

/**
 * 获取词汇复习次数
 * @param {string} word - 词汇
 * @returns {number} - 复习次数
 */
function getWordReviewCount(word) {
    try {
        const reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        return reviewData[word]?.count || 0;
    } catch (error) {
        console.error('Error getting word review count:', error);
        return 0;
    }
}

/**
 * 获取词汇上次复习时间
 * @param {string} word - 词汇
 * @returns {string|null} - 上次复习时间
 */
function getWordLastReviewed(word) {
    try {
        const reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        return reviewData[word]?.lastReviewed || null;
    } catch (error) {
        console.error('Error getting word last reviewed:', error);
        return null;
    }
}

/**
 * 获取词汇难度
 * @param {string} word - 词汇
 * @returns {string} - 难度级别
 */
function getWordDifficulty(word) {
    try {
        const reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        return reviewData[word]?.difficulty || 'medium';
    } catch (error) {
        console.error('Error getting word difficulty:', error);
        return 'medium';
    }
}

/**
 * 格式化上次复习时间
 * @param {string|null} lastReviewed - 上次复习时间
 * @returns {string} - 格式化的时间
 */
function formatLastReviewed(lastReviewed) {
    if (!lastReviewed) return '从未复习';
    
    const reviewDate = new Date(lastReviewed);
    const now = new Date();
    const diffTime = now.getTime() - reviewDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}月前`;
}

/**
 * 标记为已复习
 * @param {string} word - 词汇
 * @param {HTMLElement} button - 按钮元素
 */
function markAsReviewed(word, button) {
    try {
        // 更新复习数据
        let reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        
        if (!reviewData[word]) {
            reviewData[word] = { count: 0, difficulty: 'medium' };
        }
        
        reviewData[word].count += 1;
        reviewData[word].lastReviewed = new Date().toISOString();
        
        localStorage.setItem('wordReviewData', JSON.stringify(reviewData));
        
        // 更新按钮状态
        button.textContent = '已复习 ✓';
        button.classList.add('reviewed');
        button.disabled = true;
        
        // 更新卡片样式
        const card = button.closest('.review-word-card');
        if (card) {
            card.classList.add('reviewed');
        }
        
        showNotification('已标记为复习完成', 'success');
        
        // 延迟重新加载
        setTimeout(() => {
            loadReviewWords();
        }, 1000);
        
    } catch (error) {
        console.error('Error marking word as reviewed:', error);
        showNotification('操作失败，请重试', 'error');
    }
}

/**
 * 标记为困难
 * @param {string} word - 词汇
 * @param {HTMLElement} button - 按钮元素
 */
function markAsDifficult(word, button) {
    try {
        let reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        
        if (!reviewData[word]) {
            reviewData[word] = { count: 0, difficulty: 'medium' };
        }
        
        reviewData[word].difficulty = 'hard';
        
        localStorage.setItem('wordReviewData', JSON.stringify(reviewData));
        
        // 更新按钮状态
        button.textContent = '已标记困难';
        button.classList.add('marked-difficult');
        
        // 更新难度徽章
        const card = button.closest('.review-word-card');
        if (card) {
            const difficultyBadge = card.querySelector('.difficulty-badge');
            if (difficultyBadge) {
                difficultyBadge.textContent = '困难';
                difficultyBadge.className = 'difficulty-badge hard';
            }
        }
        
        showNotification('已标记为困难词汇', 'warning');
        
    } catch (error) {
        console.error('Error marking word as difficult:', error);
        showNotification('操作失败，请重试', 'error');
    }
}

/**
 * 从复习列表中移除
 * @param {string} word - 词汇
 * @param {HTMLElement} button - 按钮元素
 */
function removeFromReview(word, button) {
    if (!confirm('确定要将此词汇从复习列表中移除吗？')) {
        return;
    }
    
    try {
        let reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        reviewWords = reviewWords.filter(w => w !== word);
        localStorage.setItem('reviewWords', JSON.stringify(reviewWords));
        
        // 移除卡片
        const card = button.closest('.review-word-card');
        if (card) {
            card.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                card.remove();
                
                // 如果没有更多词汇，重新加载页面
                const remainingCards = document.querySelectorAll('.review-word-card');
                if (remainingCards.length === 0) {
                    loadReviewWords();
                }
            }, 300);
        }
        
        showNotification('已从复习列表中移除', 'info');
        
    } catch (error) {
        console.error('Error removing word from review:', error);
        showNotification('操作失败，请重试', 'error');
    }
}

/**
 * 开始复习会话
 */
function startReviewSession() {
    try {
        const reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        
        if (reviewWords.length === 0) {
            showNotification('没有需要复习的词汇', 'info');
            return;
        }
        
        // 创建复习会话界面
        createReviewSession(reviewWords);
        
    } catch (error) {
        console.error('Error starting review session:', error);
        showNotification('启动复习会话失败', 'error');
    }
}

/**
 * 创建复习会话界面
 * @param {Array} words - 复习词汇数组
 */
function createReviewSession(words) {
    const reviewContainer = document.getElementById('reviewContainer');
    
    // 隐藏主要内容
    const mainContent = reviewContainer.querySelector('.review-main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // 创建会话界面
    const sessionInterface = document.createElement('div');
    sessionInterface.className = 'review-session-interface';
    sessionInterface.id = 'reviewSessionInterface';
    
    sessionInterface.innerHTML = `
        <div class="session-header">
            <button class="btn btn-secondary" onclick="exitReviewSession()">退出复习</button>
            <div class="session-progress">
                <span id="sessionCurrent">1</span> / <span id="sessionTotal">${words.length}</span>
            </div>
            <div class="session-mode">
                <select id="sessionMode" onchange="changeSessionMode()">
                    <option value="flashcard">闪卡模式</option>
                    <option value="quiz">测试模式</option>
                    <option value="spelling">拼写模式</option>
                </select>
            </div>
        </div>
        
        <div class="session-content" id="sessionContent">
            <!-- 会话内容将在这里动态生成 -->
        </div>
        
        <div class="session-controls">
            <button class="btn btn-secondary" id="sessionPrev" onclick="previousSessionWord()">上一个</button>
            <button class="btn btn-primary" id="sessionNext" onclick="nextSessionWord()">下一个</button>
        </div>
    `;
    
    reviewContainer.appendChild(sessionInterface);
    
    // 初始化会话状态
    window.reviewSession = {
        words: words,
        currentIndex: 0,
        mode: 'flashcard',
        completed: []
    };
    
    // 显示第一个词汇
    showSessionWord();
}

/**
 * 显示会话词汇
 */
function showSessionWord() {
    const session = window.reviewSession;
    if (!session || session.currentIndex >= session.words.length) {
        completeReviewSession();
        return;
    }
    
    const word = session.words[session.currentIndex];
    const wordData = vocabularyManager.getWordByText(word);
    
    if (!wordData) {
        nextSessionWord();
        return;
    }
    
    const sessionContent = document.getElementById('sessionContent');
    const mode = session.mode;
    
    switch (mode) {
        case 'flashcard':
            showFlashcard(wordData, sessionContent);
            break;
        case 'quiz':
            showQuiz(wordData, sessionContent);
            break;
        case 'spelling':
            showSpelling(wordData, sessionContent);
            break;
    }
    
    // 更新进度
    updateSessionProgress();
}

/**
 * 显示闪卡
 * @param {Object} wordData - 词汇数据
 * @param {HTMLElement} container - 容器元素
 */
function showFlashcard(wordData, container) {
    container.innerHTML = `
        <div class="flashcard" id="flashcard">
            <div class="flashcard-front">
                <div class="card-word">${wordData.word}</div>
                <div class="card-phonetic">${wordData.phonetic || ''}</div>
                <button class="pronunciation-btn" onclick="pronounceWord('${wordData.word}')">🔊</button>
            </div>
            <div class="flashcard-back" style="display: none;">
                <div class="card-meaning">${wordData.meaning || ''}</div>
                <div class="card-example">${wordData.example || ''}</div>
                <div class="card-actions">
                    <button class="btn btn-success" onclick="markSessionWordAsKnown()">认识</button>
                    <button class="btn btn-warning" onclick="markSessionWordAsUnsure()">不确定</button>
                    <button class="btn btn-danger" onclick="markSessionWordAsUnknown()">不认识</button>
                </div>
            </div>
        </div>
        <div class="flashcard-controls">
            <button class="btn btn-primary" onclick="flipFlashcard()">翻转卡片</button>
        </div>
    `;
}

/**
 * 翻转闪卡
 */
function flipFlashcard() {
    const front = document.querySelector('.flashcard-front');
    const back = document.querySelector('.flashcard-back');
    const flipButton = document.querySelector('.flashcard-controls button');
    
    if (front.style.display !== 'none') {
        front.style.display = 'none';
        back.style.display = 'block';
        flipButton.textContent = '显示正面';
    } else {
        front.style.display = 'block';
        back.style.display = 'none';
        flipButton.textContent = '翻转卡片';
    }
}

/**
 * 标记会话词汇为已知
 */
function markSessionWordAsKnown() {
    const session = window.reviewSession;
    const word = session.words[session.currentIndex];
    
    // 记录结果
    session.completed.push({
        word: word,
        result: 'known',
        timestamp: new Date().toISOString()
    });
    
    // 更新复习数据
    markAsReviewed(word, { textContent: '', classList: { add: () => {}, remove: () => {} }, disabled: false });
    
    showNotification('标记为已掌握', 'success');
    
    // 自动进入下一个
    setTimeout(() => {
        nextSessionWord();
    }, 500);
}

/**
 * 标记会话词汇为不确定
 */
function markSessionWordAsUnsure() {
    const session = window.reviewSession;
    const word = session.words[session.currentIndex];
    
    session.completed.push({
        word: word,
        result: 'unsure',
        timestamp: new Date().toISOString()
    });
    
    showNotification('标记为不确定', 'warning');
    
    setTimeout(() => {
        nextSessionWord();
    }, 500);
}

/**
 * 标记会话词汇为未知
 */
function markSessionWordAsUnknown() {
    const session = window.reviewSession;
    const word = session.words[session.currentIndex];
    
    session.completed.push({
        word: word,
        result: 'unknown',
        timestamp: new Date().toISOString()
    });
    
    // 标记为困难
    markAsDifficult(word, { textContent: '', classList: { add: () => {} } });
    
    showNotification('标记为不认识', 'info');
    
    setTimeout(() => {
        nextSessionWord();
    }, 500);
}

/**
 * 下一个会话词汇
 */
function nextSessionWord() {
    const session = window.reviewSession;
    if (session.currentIndex < session.words.length - 1) {
        session.currentIndex += 1;
        showSessionWord();
    } else {
        completeReviewSession();
    }
}

/**
 * 上一个会话词汇
 */
function previousSessionWord() {
    const session = window.reviewSession;
    if (session.currentIndex > 0) {
        session.currentIndex -= 1;
        showSessionWord();
    }
}

/**
 * 更新会话进度
 */
function updateSessionProgress() {
    const session = window.reviewSession;
    const currentEl = document.getElementById('sessionCurrent');
    const totalEl = document.getElementById('sessionTotal');
    
    if (currentEl) currentEl.textContent = session.currentIndex + 1;
    if (totalEl) totalEl.textContent = session.words.length;
    
    // 更新按钮状态
    const prevButton = document.getElementById('sessionPrev');
    const nextButton = document.getElementById('sessionNext');
    
    if (prevButton) {
        prevButton.disabled = session.currentIndex === 0;
    }
    
    if (nextButton) {
        nextButton.textContent = session.currentIndex === session.words.length - 1 ? '完成' : '下一个';
    }
}

/**
 * 完成复习会话
 */
function completeReviewSession() {
    const session = window.reviewSession;
    const sessionContent = document.getElementById('sessionContent');
    
    // 统计结果
    const known = session.completed.filter(item => item.result === 'known').length;
    const unsure = session.completed.filter(item => item.result === 'unsure').length;
    const unknown = session.completed.filter(item => item.result === 'unknown').length;
    
    sessionContent.innerHTML = `
        <div class="session-complete">
            <div class="completion-icon">🎉</div>
            <h2>复习完成！</h2>
            
            <div class="session-stats">
                <div class="stat-item">
                    <div class="stat-value known">${known}</div>
                    <div class="stat-label">已掌握</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value unsure">${unsure}</div>
                    <div class="stat-label">不确定</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value unknown">${unknown}</div>
                    <div class="stat-label">不认识</div>
                </div>
            </div>
            
            <div class="completion-actions">
                <button class="btn btn-primary" onclick="startReviewSession()">再次复习</button>
                <button class="btn btn-secondary" onclick="exitReviewSession()">返回列表</button>
            </div>
        </div>
    `;
    
    // 隐藏控制按钮
    const controls = document.querySelector('.session-controls');
    if (controls) controls.style.display = 'none';
    
    // 保存会话记录
    saveReviewSession(session);
}

/**
 * 退出复习会话
 */
function exitReviewSession() {
    const sessionInterface = document.getElementById('reviewSessionInterface');
    const mainContent = document.querySelector('.review-main-content');
    
    if (sessionInterface) {
        sessionInterface.remove();
    }
    
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // 清除会话状态
    window.reviewSession = null;
    
    // 重新加载复习词汇
    loadReviewWords();
}

/**
 * 保存复习会话记录
 * @param {Object} session - 会话对象
 */
function saveReviewSession(session) {
    try {
        const sessionRecord = {
            date: new Date().toISOString(),
            wordsCount: session.words.length,
            completed: session.completed,
            mode: session.mode
        };
        
        let sessionHistory = JSON.parse(localStorage.getItem('reviewSessionHistory')) || [];
        sessionHistory.push(sessionRecord);
        
        // 只保留最近50次记录
        if (sessionHistory.length > 50) {
            sessionHistory = sessionHistory.slice(-50);
        }
        
        localStorage.setItem('reviewSessionHistory', JSON.stringify(sessionHistory));
        
    } catch (error) {
        console.error('Error saving review session:', error);
    }
}

/**
 * 清除已掌握的词汇
 */
function clearAllReviewed() {
    if (!confirm('确定要清除所有已掌握的词汇吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        const reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        const reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        
        // 过滤出复习次数少于3次的词汇
        const filteredWords = reviewWords.filter(word => {
            const wordData = reviewData[word];
            return !wordData || wordData.count < 3;
        });
        
        localStorage.setItem('reviewWords', JSON.stringify(filteredWords));
        
        const removedCount = reviewWords.length - filteredWords.length;
        showNotification(`已清除 ${removedCount} 个已掌握的词汇`, 'success');
        
        // 重新加载
        loadReviewWords();
        
    } catch (error) {
        console.error('Error clearing reviewed words:', error);
        showNotification('清除操作失败', 'error');
    }
}

/**
 * 初始化复习模式
 */
function initializeReviewModes() {
    // 复习模式相关功能可以在这里实现
}

/**
 * 设置复习事件监听器
 */
function setupReviewEventListeners() {
    // 可以添加其他事件监听器
}

/**
 * 加载复习统计
 */
function loadReviewStats() {
    const statsContainer = document.getElementById('reviewStatsContainer');
    if (!statsContainer) return;
    
    try {
        const reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        const reviewData = JSON.parse(localStorage.getItem('wordReviewData')) || {};
        const sessionHistory = JSON.parse(localStorage.getItem('reviewSessionHistory')) || [];
        
        // 计算统计数据
        const totalReviewWords = reviewWords.length;
        const reviewedWords = reviewWords.filter(word => {
            const data = reviewData[word];
            return data && data.count > 0;
        }).length;
        
        const totalSessions = sessionHistory.length;
        const recentSessions = sessionHistory.filter(session => {
            const sessionDate = new Date(session.date);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return sessionDate > weekAgo;
        }).length;
        
        statsContainer.innerHTML = `
            <div class="review-stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-info">
                        <div class="stat-value">${totalReviewWords}</div>
                        <div class="stat-label">复习词汇</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                        <div class="stat-value">${reviewedWords}</div>
                        <div class="stat-label">已复习</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <div class="stat-value">${totalSessions}</div>
                        <div class="stat-label">复习次数</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📅</div>
                    <div class="stat-info">
                        <div class="stat-value">${recentSessions}</div>
                        <div class="stat-label">本周复习</div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading review stats:', error);
        statsContainer.innerHTML = '<p>无法加载统计数据</p>';
    }
}

// 导出函数到全局作用域
window.markAsReviewed = markAsReviewed;
window.markAsDifficult = markAsDifficult;
window.removeFromReview = removeFromReview;
window.startReviewSession = startReviewSession;
window.exitReviewSession = exitReviewSession;
window.flipFlashcard = flipFlashcard;
window.markSessionWordAsKnown = markSessionWordAsKnown;
window.markSessionWordAsUnsure = markSessionWordAsUnsure;
window.markSessionWordAsUnknown = markSessionWordAsUnknown;
window.nextSessionWord = nextSessionWord;
window.previousSessionWord = previousSessionWord;
window.clearAllReviewed = clearAllReviewed;

// 占位符函数
function showQuiz(wordData, container) {
    container.innerHTML = '<p>测试模式正在开发中...</p>';
}

function showSpelling(wordData, container) {
    container.innerHTML = '<p>拼写模式正在开发中...</p>';
}

function changeSessionMode() {
    const session = window.reviewSession;
    const modeSelect = document.getElementById('sessionMode');
    
    if (session && modeSelect) {
        session.mode = modeSelect.value;
        showSessionWord();
    }
}

window.changeSessionMode = changeSessionMode;