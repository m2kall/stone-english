/**
 * 搜索功能脚本
 * 处理词汇搜索和过滤
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchPage();
});

/**
 * 初始化搜索页面
 */
function initializeSearchPage() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const clearFiltersButton = document.getElementById('clearFilters');
    
    if (!searchInput || !searchResults) return;
    
    // 搜索输入事件
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 搜索按钮事件
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // 过滤器事件
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
        loadCategories();
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', performSearch);
    }
    
    // 清除过滤器按钮
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', clearFilters);
    }
    
    // 显示默认搜索结果
    showDefaultResults();
}

/**
 * 执行搜索
 */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const searchResults = document.getElementById('searchResults');
    
    if (!vocabularyManager || !vocabularyManager.isInitialized) {
        searchResults.innerHTML = '<p class="no-results">词汇管理器未初始化</p>';
        return;
    }
    
    const query = searchInput.value.trim();
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const selectedLevel = levelFilter ? levelFilter.value : '';
    
    let results = [];
    
    if (query) {
        // 基于查询搜索
        results = vocabularyManager.searchWords(query, 50);
    } else {
        // 显示默认结果
        results = vocabularyManager.getWordsByLevel('basic', 20, 0);
    }
    
    // 应用过滤器
    if (selectedCategory) {
        results = results.filter(word => word.category === selectedCategory);
    }
    
    if (selectedLevel) {
        results = results.filter(word => word.level === selectedLevel);
    }
    
    // 显示结果
    displaySearchResults(results, query);
    
    // 更新结果计数
    updateResultsCount(results.length);
}

/**
 * 显示搜索结果
 * @param {Array} results - 搜索结果数组
 * @param {string} query - 搜索查询
 */
function displaySearchResults(results, query = '') {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>没有找到相关单词</p>
                ${query ? `<p>尝试搜索其他关键词</p>` : ''}
            </div>
        `;
        return;
    }
    
    // 创建结果网格
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'search-results-grid';
    
    results.forEach(word => {
        const wordCard = createSearchResultCard(word, query);
        resultsGrid.appendChild(wordCard);
    });
    
    searchResults.innerHTML = '';
    searchResults.appendChild(resultsGrid);
}

/**
 * 创建搜索结果卡片
 * @param {Object} wordData - 词汇数据
 * @param {string} query - 搜索查询
 * @returns {HTMLElement} - 搜索结果卡片
 */
function createSearchResultCard(wordData, query = '') {
    const card = document.createElement('div');
    card.className = 'search-result-card';
    
    // 高亮搜索关键词
    const highlightedWord = highlightSearchTerm(wordData.word, query);
    const highlightedMeaning = highlightSearchTerm(wordData.meaning || '', query);
    
    const isLearned = checkIfWordIsLearned(wordData.word);
    const isInReview = checkIfWordIsInReview(wordData.word);
    
    card.innerHTML = `
        <div class="word-header">
            <span class="word-text">${highlightedWord}</span>
            <div class="word-badges">
                ${wordData.level ? `<span class="level-badge ${wordData.level}">${wordData.level}</span>` : ''}
                ${wordData.category ? `<span class="category-badge">${wordData.category}</span>` : ''}
            </div>
        </div>
        
        <div class="word-phonetic">${wordData.phonetic || ''}</div>
        <div class="word-meaning">${highlightedMeaning}</div>
        
        ${wordData.example ? `<div class="word-example">"${wordData.example}"</div>` : ''}
        
        <div class="word-frequency">
            <span class="frequency-label">频率:</span>
            <div class="frequency-bar">
                <div class="frequency-fill" style="width: ${Math.min(wordData.frequency / 100, 100)}%"></div>
            </div>
        </div>
        
        <div class="word-actions">
            <button class="btn-icon" onclick="pronounceWord('${wordData.word}')" title="发音">
                🔊
            </button>
            <button class="btn-small ${isLearned ? 'learned' : ''}" 
                    onclick="toggleLearnedWord('${wordData.word}', this)"
                    title="${isLearned ? '取消掌握' : '标记掌握'}">
                ${isLearned ? '已掌握' : '掌握'}
            </button>
            <button class="btn-small ${isInReview ? 'in-review' : ''}" 
                    onclick="toggleReviewWord('${wordData.word}', this)"
                    title="${isInReview ? '移出复习' : '加入复习'}">
                ${isInReview ? '复习中' : '复习'}
            </button>
            <button class="btn-small" onclick="showWordDetails('${wordData.word}')" title="详细信息">
                详情
            </button>
        </div>
    `;
    
    return card;
}

/**
 * 高亮搜索关键词
 * @param {string} text - 原文本
 * @param {string} query - 搜索查询
 * @returns {string} - 高亮后的文本
 */
function highlightSearchTerm(text, query) {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 转义正则表达式特殊字符
 * @param {string} string - 要转义的字符串
 * @returns {string} - 转义后的字符串
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 检查单词是否在复习列表中
 * @param {string} word - 单词
 * @returns {boolean} - 是否在复习列表中
 */
function checkIfWordIsInReview(word) {
    try {
        const reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        return reviewWords.includes(word);
    } catch (error) {
        console.error('Error checking if word is in review:', error);
        return false;
    }
}

/**
 * 切换单词复习状态
 * @param {string} word - 单词
 * @param {HTMLElement} button - 按钮元素
 */
function toggleReviewWord(word, button) {
    try {
        let reviewWords = JSON.parse(localStorage.getItem('reviewWords')) || [];
        
        if (reviewWords.includes(word)) {
            // 从复习列表中移除
            reviewWords = reviewWords.filter(w => w !== word);
            button.textContent = '复习';
            button.classList.remove('in-review');
            showNotification('已从复习列表中移除', 'info');
        } else {
            // 添加到复习列表
            reviewWords.push(word);
            button.textContent = '复习中';
            button.classList.add('in-review');
            showNotification('已添加到复习列表', 'success');
        }
        
        localStorage.setItem('reviewWords', JSON.stringify(reviewWords));
    } catch (error) {
        console.error('Error toggling review word:', error);
        showNotification('操作失败，请重试', 'error');
    }
}

/**
 * 显示默认搜索结果
 */
function showDefaultResults() {
    if (!vocabularyManager || !vocabularyManager.isInitialized) {
        // 延迟加载
        setTimeout(showDefaultResults, 500);
        return;
    }
    
    // 显示一些常用单词
    const defaultWords = vocabularyManager.getWordsByLevel('basic', 12, 0);
    displaySearchResults(defaultWords);
    updateResultsCount(defaultWords.length);
}

/**
 * 加载分类选项
 */
function loadCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter || !vocabularyManager || !vocabularyManager.isInitialized) {
        // 延迟加载
        setTimeout(loadCategories, 500);
        return;
    }
    
    const categories = vocabularyManager.getAllCategories();
    
    // 清空现有选项（保留"全部分类"）
    while (categoryFilter.children.length > 1) {
        categoryFilter.removeChild(categoryFilter.lastChild);
    }
    
    // 添加分类选项
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = `${category.name} (${category.count})`;
        categoryFilter.appendChild(option);
    });
}

/**
 * 清除过滤器
 */
function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    
    // 重新搜索
    performSearch();
    
    showNotification('已清除所有过滤器', 'info');
}

/**
 * 更新结果计数
 * @param {number} count - 结果数量
 */
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `找到 ${count} 个单词`;
    }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 导出函数到全局作用域
window.toggleReviewWord = toggleReviewWord;
window.performSearch = performSearch;
window.clearFilters = clearFilters;