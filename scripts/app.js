/**
 * 主应用脚本
 * 处理页面交互和功能实现
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化词汇管理器
    if (window.vocabularyManager) {
        vocabularyManager.initialize().then(() => {
            // 更新页面统计信息
            updateStatistics();
            
            // 加载每日词汇
            loadDailyWords();
            
            // 初始化浮动单词动画
            initFloatingWords();
            
            // 初始化快速练习
            initQuickPractice();
            
            // 设置事件监听器
            setupEventListeners();
        });
    } else {
        console.error('Vocabulary manager not found!');
    }
    
    // 设置移动端导航菜单
    setupMobileNav();
    
    // 更新最后更新时间
    updateLastUpdateTime();
});

/**
 * 更新页面统计信息
 */
function updateStatistics() {
    // 更新总词汇量
    const totalWordsElement = document.getElementById('totalWords');
    if (totalWordsElement) {
        const totalWords = vocabularyManager.getTotalWordCount();
        totalWordsElement.textContent = totalWords.toLocaleString();
    }
    
    // 从本地存储获取已学习词汇数量
    const learnedWordsElement = document.getElementById('learnedWords');
    if (learnedWordsElement) {
        const learnedWords = getLearnedWordsCount();
        learnedWordsElement.textContent = learnedWords.toLocaleString();
    }
    
    // 从本地存储获取学习天数
    const studyDaysElement = document.getElementById('studyDays');
    if (studyDaysElement) {
        const studyDays = getStudyDaysCount();
        studyDaysElement.textContent = studyDays;
    }
}

/**
 * 获取已学习词汇数量
 */
function getLearnedWordsCount() {
    try {
        const learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];
        return learnedWords.length;
    } catch (error) {
        console.error('Error getting learned words count:', error);
        return 0;
    }
}

/**
 * 获取学习天数
 */
function getStudyDaysCount() {
    try {
        const studyDays = JSON.parse(localStorage.getItem('studyDays')) || [];
        return studyDays.length;
    } catch (error) {
        console.error('Error getting study days count:', error);
        return 0;
    }
}

/**
 * 加载每日词汇
 */
function loadDailyWords() {
    const dailyWordsContainer = document.getElementById('dailyWordsContainer');
    if (!dailyWordsContainer) return;
    
    // 获取选择的级别
    const levelSelect = document.getElementById('levelSelect');
    const selectedLevel = levelSelect ? levelSelect.value : 'basic';
    
    // 获取每日词汇
    const dailyWords = vocabularyManager.getDailyWords(selectedLevel, 6);
    
    // 清空容器
    dailyWordsContainer.innerHTML = '';
    
    // 添加词汇卡片
    dailyWords.forEach(word => {
        const wordCard = createWordCard(word);
        dailyWordsContainer.appendChild(wordCard);
    });
}

/**
 * 创建词汇卡片
 * @param {Object} wordData - 词汇数据
 * @returns {HTMLElement} - 词汇卡片元素
 */
function createWordCard(wordData) {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.dataset.word = wordData.word;
    
    const isLearned = checkIfWordIsLearned(wordData.word);
    
    card.innerHTML = `
        <div class="word-header">
            <span class="word-text">${wordData.word}</span>
            <button class="pronunciation-btn" onclick="pronounceWord('${wordData.word}')">🔊</button>
        </div>
        <div class="word-phonetic">${wordData.phonetic || ''}</div>
        <div class="word-meaning">${wordData.meaning || ''}</div>
        <div class="word-example">${wordData.example || ''}</div>
        <div class="word-actions">
            <button class="btn-small ${isLearned ? 'learned' : ''}" onclick="toggleLearnedWord('${wordData.word}', this)">
                ${isLearned ? '已掌握' : '标记已学'}
            </button>
            <button class="btn-small" onclick="addToReview('${wordData.word}', this)">加入复习</button>
            <button class="btn-small" onclick="showWordDetails('${wordData.word}')">详情</button>
        </div>
    `;
    
    return card;
}

/**
 * 检查单词是否已学习
 * @param {string} word - 单词
 * @returns {boolean} - 是否已学习
 */
function checkIfWordIsLearned(word) {
    try {
        const learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];
        return learnedWords.includes(word);
    } catch (error) {
        console.error('Error checking if word is learned:', error);
        return false;
    }
}

/**
 * 切换单词学习状态
 * @param {string} word - 单词
 * @param {HTMLElement} button - 按钮元素
 */
function toggleLearnedWord(word, button) {
    try {
        let learnedWords = JSON.parse(localStorage.getItem('learnedWords')) || [];
        
        if (learnedWords.includes(word)) {
            // 从已学习列表中移除
            learnedWords = learnedWords.filter(w => w !== word);
            button.textContent = '标记已学';
            button.classList.remove('learned');
            showNotification('已从已学习列表中移除', 'info');
        } else {
            // 添加到已学习列表
            learnedWords.push(word);
            button.textContent = '已掌握';
            button.classList.add('learned');
            showNotification('已添加到已学习列表', 'success');
            
            // 记录学习日期
            recordStudyDay();
        }
        
        localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
        
        // 更新统计信息
        updateStatistics();
    } catch (error) {
        console.error('Error toggling learned word:', error);
        showNotification('操作失败，请重试', 'error');
    }
}

/**
 * 记录学习日期
 */
function recordStudyDay() {
    try {
        const today = new Date().toISOString().split('T')[0]; // 格式: YYYY-MM-DD
        let studyDays = JSON.parse(localStorage.getItem('studyDays')) || [];
        
        if (!studyDays.includes(today)) {
            studyDays.push(today);
            localStorage.setItem('studyDays', JSON.stringify(studyDays));
        }
    } catch (error) {
        console.error('Error recording study day:', error);
    }
}

/**
 * 添加单词到复习列表
 * @param {string} word - 单词
 * @param {HTMLElement} button - 按钮元素
 */
function addToReview(word, button) {
    try {
        let reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        
        if (!reviewWords.includes(word)) {
            reviewWords.push(word);
            localStorage.setItem('reviewWords', JSON.stringify(reviewWords));
            button.textContent = '已加入复习';
            button.classList.add('review');
            showNotification('已添加到复习列表', 'success');
        } else {
            showNotification('该单词已在复习列表中', 'info');
        }
    } catch (error) {
        console.error('Error adding word to review:', error);
        showNotification('操作失败，请重试', 'error');
    }
}

/**
 * 显示单词详情
 * @param {string} word - 单词
 */
function showWordDetails(word) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">单词详情</h2>
                <button class="modal-close" onclick="closeModal(this.parentElement.parentElement.parentElement)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="loading">加载中...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 显示模态框
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // 加载单词详情
    vocabularyManager.getWordDetails(word).then(details => {
        const modalBody = modal.querySelector('.modal-body');
        
        if (!details) {
            modalBody.innerHTML = '<p>无法获取单词详情</p>';
            return;
        }
        
        let meaningsHTML = '';
        if (details.meanings && details.meanings.length > 0) {
            meaningsHTML = details.meanings.map(meaning => {
                const definitions = meaning.definitions.map(def => {
                    return `
                        <div class="definition">
                            <p>${def.definition}</p>
                            ${def.example ? `<p class="example">"${def.example}"</p>` : ''}
                        </div>
                    `;
                }).join('');
                
                return `
                    <div class="meaning-group">
                        <h4 class="part-of-speech">${meaning.partOfSpeech}</h4>
                        ${definitions}
                    </div>
                `;
            }).join('');
        }
        
        modalBody.innerHTML = `
            <div class="word-detail">
                <h3 class="word-title">${details.word}</h3>
                <p class="word-phonetic">${details.phonetic || ''}</p>
                
                <div class="meanings">
                    ${meaningsHTML || '<p>暂无详细释义</p>'}
                </div>
                
                ${details.audio ? `
                <div class="audio-section">
                    <h4>发音</h4>
                    <audio controls>
                        <source src="${details.audio}" type="audio/mpeg">
                        您的浏览器不支持音频播放
                    </audio>
                </div>
                ` : ''}
            </div>
        `;
    }).catch(error => {
        console.error('Error fetching word details:', error);
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = '<p>加载单词详情时出错</p>';
    });
}

/**
 * 关闭模态框
 * @param {HTMLElement} modal - 模态框元素
 */
function closeModal(modal) {
    modal.classList.remove('active');
    
    // 延迟移除元素
    setTimeout(() => {
        modal.remove();
    }, 300);
}

/**
 * 发音单词
 * @param {string} word - 单词
 */
function pronounceWord(word) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(word);
        speech.lang = 'en-US';
        speechSynthesis.speak(speech);
    } else {
        console.warn('Browser does not support speech synthesis');
    }
}

/**
 * 初始化浮动单词动画
 */
function initFloatingWords() {
    const floatingWordsContainer = document.getElementById('floatingWords');
    if (!floatingWordsContainer) return;
    
    // 获取随机单词
    const randomWords = vocabularyManager.getWordsByLevel('basic', 20, 0);
    
    // 创建浮动单词元素
    randomWords.forEach(wordData => {
        const wordElement = document.createElement('div');
        wordElement.className = 'floating-word';
        wordElement.textContent = wordData.word;
        
        // 随机位置
        const randomX = Math.floor(Math.random() * 80) + 10; // 10% - 90%
        const randomY = Math.floor(Math.random() * 80) + 10; // 10% - 90%
        
        // 随机动画延迟
        const randomDelay = Math.random() * 8;
        
        wordElement.style.left = `${randomX}%`;
        wordElement.style.top = `${randomY}%`;
        wordElement.style.animationDelay = `${randomDelay}s`;
        
        floatingWordsContainer.appendChild(wordElement);
    });
}

/**
 * 初始化快速练习
 */
function initQuickPractice() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;
    
    // 生成练习题
    generateQuestion();
    
    // 设置下一题按钮事件
    const nextButton = document.getElementById('nextQuestion');
    if (nextButton) {
        nextButton.addEventListener('click', generateQuestion);
    }
    
    // 设置跳过按钮事件
    const skipButton = document.getElementById('skipQuestion');
    if (skipButton) {
        skipButton.addEventListener('click', generateQuestion);
    }
}

/**
 * 生成练习题
 */
function generateQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    if (!questionContainer) return;
    
    // 清除结果显示
    const resultElement = document.querySelector('.practice-result');
    if (resultElement) {
        resultElement.textContent = '';
        resultElement.className = 'practice-result';
    }
    
    // 获取随机单词
    const randomWords = vocabularyManager.getWordsByLevel('basic', 5, 0);
    
    if (randomWords.length === 0) {
        questionContainer.innerHTML = '<p>无法加载练习题</p>';
        return;
    }
    
    // 选择一个作为问题
    const questionWord = randomWords[0];
    
    // 随机选择题型
    const questionTypes = ['meaning', 'word'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // 根据题型生成题目
    if (questionType === 'meaning') {
        // 选择单词含义的题目
        questionContainer.innerHTML = `
            <div class="question">
                <div class="question-type">选择正确含义</div>
                <div class="question-word">${questionWord.word}</div>
            </div>
            <div class="options-grid" id="optionsGrid"></div>
            <div class="practice-result"></div>
        `;
        
        // 生成选项
        const optionsGrid = document.getElementById('optionsGrid');
        
        // 正确选项
        const correctOption = document.createElement('button');
        correctOption.className = 'option-btn';
        correctOption.textContent = questionWord.meaning;
        correctOption.dataset.correct = 'true';
        correctOption.addEventListener('click', checkAnswer);
        
        // 错误选项
        const wrongOptions = [];
        for (let i = 1; i < randomWords.length; i++) {
            const option = document.createElement('button');
            option.className = 'option-btn';
            option.textContent = randomWords[i].meaning;
            option.dataset.correct = 'false';
            option.addEventListener('click', checkAnswer);
            wrongOptions.push(option);
        }
        
        // 打乱选项顺序
        const allOptions = [correctOption, ...wrongOptions];
        shuffleArray(allOptions);
        
        // 添加到选项网格
        allOptions.forEach(option => {
            optionsGrid.appendChild(option);
        });
    } else {
        // 选择单词的题目
        questionContainer.innerHTML = `
            <div class="question">
                <div class="question-type">选择正确单词</div>
                <div class="question-text">${questionWord.meaning}</div>
            </div>
            <div class="options-grid" id="optionsGrid"></div>
            <div class="practice-result"></div>
        `;
        
        // 生成选项
        const optionsGrid = document.getElementById('optionsGrid');
        
        // 正确选项
        const correctOption = document.createElement('button');
        correctOption.className = 'option-btn';
        correctOption.textContent = questionWord.word;
        correctOption.dataset.correct = 'true';
        correctOption.addEventListener('click', checkAnswer);
        
        // 错误选项
        const wrongOptions = [];
        for (let i = 1; i < randomWords.length; i++) {
            const option = document.createElement('button');
            option.className = 'option-btn';
            option.textContent = randomWords[i].word;
            option.dataset.correct = 'false';
            option.addEventListener('click', checkAnswer);
            wrongOptions.push(option);
        }
        
        // 打乱选项顺序
        const allOptions = [correctOption, ...wrongOptions];
        shuffleArray(allOptions);
        
        // 添加到选项网格
        allOptions.forEach(option => {
            optionsGrid.appendChild(option);
        });
    }
}

/**
 * 检查答案
 * @param {Event} event - 点击事件
 */
function checkAnswer(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === 'true';
    
    // 禁用所有选项
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(option => {
        option.disabled = true;
    });
    
    // 标记正确/错误
    if (isCorrect) {
        selectedOption.classList.add('correct');
        
        // 显示正确提示
        const resultElement = document.querySelector('.practice-result');
        if (resultElement) {
            resultElement.textContent = '回答正确！';
            resultElement.className = 'practice-result correct';
        }
        
        // 更新统计
        updatePracticeStats(true);
    } else {
        selectedOption.classList.add('incorrect');
        
        // 标记正确答案
        allOptions.forEach(option => {
            if (option.dataset.correct === 'true') {
                option.classList.add('correct');
            }
        });
        
        // 显示错误提示
        const resultElement = document.querySelector('.practice-result');
        if (resultElement) {
            resultElement.textContent = '回答错误！';
            resultElement.className = 'practice-result incorrect';
        }
        
        // 更新统计
        updatePracticeStats(false);
    }
    
    // 延迟生成下一题
    setTimeout(() => {
        const nextButton = document.getElementById('nextQuestion');
        if (nextButton) {
            nextButton.focus();
        }
    }, 500);
}

/**
 * 更新练习统计
 * @param {boolean} isCorrect - 是否回答正确
 */
function updatePracticeStats(isCorrect) {
    try {
        // 获取当前统计
        let stats = JSON.parse(localStorage.getItem('practiceStats')) || {
            total: 0,
            correct: 0,
            streak: 0,
            maxStreak: 0
        };
        
        // 更新统计
        stats.total += 1;
        
        if (isCorrect) {
            stats.correct += 1;
            stats.streak += 1;
            if (stats.streak > stats.maxStreak) {
                stats.maxStreak = stats.streak;
            }
        } else {
            stats.streak = 0;
        }
        
        // 保存统计
        localStorage.setItem('practiceStats', JSON.stringify(stats));
        
        // 更新显示
        const accuracyElement = document.getElementById('accuracy');
        if (accuracyElement) {
            const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            accuracyElement.textContent = `${accuracy}%`;
        }
        
        const streakElement = document.getElementById('streak');
        if (streakElement) {
            streakElement.textContent = stats.streak;
        }
        
        const totalAnsweredElement = document.getElementById('totalAnswered');
        if (totalAnsweredElement) {
            totalAnsweredElement.textContent = stats.total;
        }
        
        const currentScoreElement = document.getElementById('currentScore');
        if (currentScoreElement) {
            currentScoreElement.textContent = stats.correct;
        }
    } catch (error) {
        console.error('Error updating practice stats:', error);
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 级别选择器变化事件
    const levelSelect = document.getElementById('levelSelect');
    if (levelSelect) {
        levelSelect.addEventListener('change', loadDailyWords);
    }
    
    // 加载更多单词按钮
    const loadMoreButton = document.getElementById('loadMoreWords');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreWords);
    }
}

/**
 * 加载更多单词
 */
function loadMoreWords() {
    const dailyWordsContainer = document.getElementById('dailyWordsContainer');
    if (!dailyWordsContainer) return;
    
    // 获取选择的级别
    const levelSelect = document.getElementById('levelSelect');
    const selectedLevel = levelSelect ? levelSelect.value : 'basic';
    
    // 获取当前显示的单词数量
    const currentCount = dailyWordsContainer.children.length;
    
    // 获取更多单词
    const moreWords = vocabularyManager.getWordsByLevel(selectedLevel, 6, currentCount);
    
    if (moreWords.length === 0) {
        showNotification('没有更多单词了', 'info');
        return;
    }
    
    // 添加词汇卡片
    moreWords.forEach(word => {
        const wordCard = createWordCard(word);
        dailyWordsContainer.appendChild(wordCard);
    });
    
    showNotification(`已加载 ${moreWords.length} 个新单词`, 'success');
}

/**
 * 设置移动端导航菜单
 */
function setupMobileNav() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // 点击菜单项时关闭菜单
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

/**
 * 更新最后更新时间
 */
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const lastUpdate = vocabularyManager ? vocabularyManager.getLastUpdateTime() : new Date();
        lastUpdateElement.textContent = formatDate(lastUpdate);
    }
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化的日期字符串
 */
function formatDate(date) {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * 打乱数组
 * @param {Array} array - 要打乱的数组
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * 显示通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, error, warning, info)
 * @param {number} duration - 显示时长（毫秒）
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 设置图标
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="removeNotification(this.parentElement)">×</button>
        <div class="notification-progress"></div>
    `;
    
    // 获取或创建通知容器
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // 添加通知
    container.appendChild(notification);
    
    // 自动移除通知
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
}

/**
 * 移除通知
 * @param {HTMLElement} notification - 通知元素
 */
function removeNotification(notification) {
    if (notification && notification.parentElement) {
        notification.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }
}

// 导出函数到全局作用域，供HTML中使用
window.pronounceWord = pronounceWord;
window.toggleLearnedWord = toggleLearnedWord;
window.addToReview = addToReview;
window.showWordDetails = showWordDetails;
window.closeModal = closeModal;
window.removeNotification = removeNotification;