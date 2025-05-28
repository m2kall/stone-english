/**
 * 词汇管理器
 * 负责词汇数据的加载、管理和处理
 */
class VocabularyManager {
    constructor() {
        this.apiSources = [
            'https://api.dictionaryapi.dev/api/v2/entries/en/',
            'https://wordsapiv1.p.rapidapi.com/words/'
            // 可以添加更多API源
        ];
        this.localCache = new Map();
        this.wordLists = {
            basic: [],
            intermediate: [],
            advanced: [],
            toefl: [],
            ielts: [],
            gre: []
        };
        this.categories = {};
        this.isInitialized = false;
        this.lastUpdate = new Date();
        this.totalWords = 0;
    }

    /**
     * 初始化词汇表
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // 尝试从本地存储加载缓存
            this.loadFromCache();
            
            // 加载基础词汇
            this.wordLists.basic = await this.loadWordList('/data/basic-1000.json');
            
            // 加载中级词汇
            this.wordLists.intermediate = await this.loadWordList('/data/intermediate-3000.json');
            
            // 加载高级词汇
            this.wordLists.advanced = await this.loadWordList('/data/advanced-5000.json');
            
            // 加载考试词汇
            this.wordLists.toefl = await this.loadWordList('/data/toefl-words.json');
            this.wordLists.ielts = await this.loadWordList('/data/ielts-words.json');
            
            // 如果任何词汇列表为空，使用生成的数据
            if (this.wordLists.basic.length === 0) {
                console.log('Using generated vocabulary data');
                this.useGeneratedData();
            }
            
            // 处理词汇分类
            this.processCategorization();
            
            // 更新总词汇量
            this.updateTotalWordCount();
            
            // 保存到缓存
            this.saveToCache();
            
            this.isInitialized = true;
            console.log('Vocabulary manager initialized successfully');
        } catch (error) {
            console.error('Error initializing vocabulary manager:', error);
            // 发生错误时使用生成的数据
            this.useGeneratedData();
        }
    }

    /**
     * 从本地存储加载缓存
     */
    loadFromCache() {
        const cached = localStorage.getItem('vocabularyData');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                this.wordLists = data.wordLists || this.wordLists;
                this.categories = data.categories || {};
                this.lastUpdate = new Date(data.lastUpdate || Date.now());
                this.totalWords = data.totalWords || 0;
                console.log('Loaded vocabulary data from cache');
            } catch (error) {
                console.error('Error loading from cache:', error);
            }
        }
    }

    /**
     * 保存到本地存储
     */
    saveToCache() {
        try {
            const data = {
                wordLists: this.wordLists,
                categories: this.categories,
                lastUpdate: this.lastUpdate,
                totalWords: this.totalWords
            };
            localStorage.setItem('vocabularyData', JSON.stringify(data));
            console.log('Saved vocabulary data to cache');
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    /**
     * 加载词汇列表
     * @param {string} url - 词汇数据文件路径
     * @returns {Promise<Array>} - 词汇数据数组
     */
    async loadWordList(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Failed to load ${url}, status: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn(`Error loading ${url}:`, error);
            return [];
        }
    }

    /**
     * 使用生成的数据
     */
    useGeneratedData() {
        if (typeof vocabularyData !== 'undefined') {
            // 从word-generator.js获取生成的数据
            const allWords = vocabularyData;
            
            // 按级别分类
            this.wordLists.basic = allWords.filter(word => word.level === 'basic');
            this.wordLists.intermediate = allWords.filter(word => word.level === 'intermediate');
            this.wordLists.advanced = allWords.filter(word => word.level === 'advanced');
            
            // 处理词汇分类
            this.processCategorization();
            
            // 更新总词汇量
            this.updateTotalWordCount();
            
            this.isInitialized = true;
        } else {
            console.error('Generated vocabulary data not available');
        }
    }

    /**
     * 处理词汇分类
     */
    processCategorization() {
        this.categories = {};
        
        // 合并所有词汇列表
        const allWords = [
            ...this.wordLists.basic,
            ...this.wordLists.intermediate,
            ...this.wordLists.advanced,
            ...this.wordLists.toefl,
            ...this.wordLists.ielts,
        ];
        
        // 按类别分组
        allWords.forEach(word => {
            if (word.category) {
                if (!this.categories[word.category]) {
                    this.categories[word.category] = [];
                }
                this.categories[word.category].push(word);
            }
        });
    }

    /**
     * 更新总词汇量
     */
    updateTotalWordCount() {
        // 使用Set去重
        const uniqueWords = new Set();
        
        Object.values(this.wordLists).forEach(list => {
            list.forEach(word => uniqueWords.add(word.word));
        });
        
        this.totalWords = uniqueWords.size;
    }

    /**
     * 获取指定级别的词汇
     * @param {string} level - 词汇级别
     * @param {number} count - 返回数量
     * @param {number} offset - 偏移量
     * @returns {Array} - 词汇数组
     */
    getWordsByLevel(level = 'basic', count = 10, offset = 0) {
        if (!this.isInitialized) {
            console.warn('Vocabulary manager not initialized');
            return [];
        }
        
        const wordList = this.wordLists[level] || this.wordLists.basic;
        
        // 如果请求的偏移量超出范围，返回空数组
        if (offset >= wordList.length) {
            return [];
        }
        
        // 计算实际可返回的数量
        const actualCount = Math.min(count, wordList.length - offset);
        
        return wordList.slice(offset, offset + actualCount);
    }

    /**
     * 获取指定类别的词汇
     * @param {string} category - 词汇类别
     * @param {number} count - 返回数量
     * @param {number} offset - 偏移量
     * @returns {Array} - 词汇数组
     */
    getWordsByCategory(category, count = 10, offset = 0) {
        if (!this.isInitialized) {
            console.warn('Vocabulary manager not initialized');
            return [];
        }
        
        const categoryWords = this.categories[category] || [];
        
        if (offset >= categoryWords.length) {
            return [];
        }
        
        const actualCount = Math.min(count, categoryWords.length - offset);
        
        return categoryWords.slice(offset, offset + actualCount);
    }

    /**
     * 搜索词汇（多字段模糊检索，支持API补充）
     * @param {string} query - 搜索关键词
     * @param {number} limit - 返回数量限制
     * @returns {Promise<Array>} - 搜索结果
     */
    async searchWords(query, limit = 20) {
        if (!query || query.trim() === '') {
            return [];
        }
        query = query.toLowerCase().trim();
        // 合并所有词汇列表
        const allWords = [
            ...this.wordLists.basic,
            ...this.wordLists.intermediate,
            ...this.wordLists.advanced,
            ...this.wordLists.toefl,
            ...this.wordLists.ielts,
        ];
        // 多字段模糊匹配
        let results = allWords.filter(word => {
            return (
                word.word.toLowerCase().includes(query) ||
                (word.meaning && word.meaning.toLowerCase().includes(query)) ||
                (word.phonetic && word.phonetic.toLowerCase().includes(query)) ||
                (word.example && word.example.toLowerCase().includes(query))
            );
        });
        // 如果本地无结果，尝试API查词
        if (results.length === 0 && /^[a-zA-Z]+$/.test(query)) {
            const apiWord = await this.getWordDetails(query);
            if (apiWord && apiWord.word) {
                results = [apiWord];
            }
        }
        return results.slice(0, limit);
    }

    /**
     * 获取每日词汇
     * @param {string} level - 词汇级别
     * @param {number} count - 返回数量
     * @returns {Array} - 每日词汇数组
     */
    getDailyWords(level = 'basic', count = 10) {
        if (!this.isInitialized) {
            console.warn('Vocabulary manager not initialized');
            return [];
        }
        
        const wordList = this.wordLists[level] || this.wordLists.basic;
        
        if (wordList.length === 0) {
            return [];
        }
        
        // 基于日期生成种子
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // 使用种子生成伪随机数
        const seededRandom = this.createSeededRandom(seed);
        
        // 打乱词汇列表
        const shuffled = [...wordList].sort(() => seededRandom() - 0.5);
        
        // 返回指定数量的词汇
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    /**
     * 创建基于种子的伪随机数生成器
     * @param {number} seed - 随机数种子
     * @returns {Function} - 随机数生成函数
     */
    createSeededRandom(seed) {
        return function() {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }

    /**
     * 从在线API获取词汇详情
     * @param {string} word - 单词
     * @returns {Promise<Object>} - 词汇详情
     */
    async getWordDetails(word) {
        // 检查本地缓存
        if (this.localCache.has(word)) {
            return this.localCache.get(word);
        }
        
        try {
            // 尝试从API获取数据
            const response = await fetch(`${this.apiSources[0]}${word}`);
            
            if (response.ok) {
                const data = await response.json();
                const wordData = this.parseApiResponse(data[0]);
                
                // 缓存结果
                this.localCache.set(word, wordData);
                
                return wordData;
            }
        } catch (error) {
            console.warn(`Failed to fetch details for ${word}:`, error);
        }
        
        // 如果API请求失败，尝试从本地数据获取
        return this.getLocalWordData(word);
    }

    /**
     * 解析API响应
     * @param {Object} data - API响应数据
     * @returns {Object} - 格式化的词汇数据
     */
    parseApiResponse(data) {
        if (!data) return null;
        
        return {
            word: data.word,
            phonetic: data.phonetic || (data.phonetics && data.phonetics[0] ? data.phonetics[0].text : ''),
            meanings: data.meanings ? data.meanings.map(m => ({
                partOfSpeech: m.partOfSpeech,
                definitions: m.definitions.slice(0, 3).map(d => ({
                    definition: d.definition,
                    example: d.example || ''
                }))
            })) : [],
            audio: data.phonetics && data.phonetics.find(p => p.audio) ? data.phonetics.find(p => p.audio).audio : ''
        };
    }

    /**
     * 从本地数据获取词汇信息
     * @param {string} word - 单词
     * @returns {Object} - 词汇数据
     */
    getLocalWordData(word) {
        // 在所有词汇列表中查找
        for (const level in this.wordLists) {
            const found = this.wordLists[level].find(w => w.word.toLowerCase() === word.toLowerCase());
            if (found) {
                return {
                    word: found.word,
                    phonetic: found.phonetic || '',
                    meanings: [{
                        partOfSpeech: '',
                        definitions: [{
                            definition: found.meaning || '',
                            example: found.example || ''
                        }]
                    }],
                    audio: ''
                };
            }
        }
        
        // 如果找不到，返回基本结构
        return {
            word: word,
            phonetic: '',
            meanings: [],
            audio: ''
        };
    }

    /**
     * 获取所有可用的词汇类别
     * @returns {Array} - 类别数组
     */
    getAllCategories() {
        return Object.keys(this.categories).map(category => ({
            name: category,
            count: this.categories[category].length
        }));
    }

    /**
     * 获取所有可用的词汇级别
     * @returns {Array} - 级别数组
     */
    getAllLevels() {
        return Object.keys(this.wordLists).map(level => ({
            name: level,
            count: this.wordLists[level].length
        }));
    }

    /**
     * 获取总词汇量
     * @returns {number} - 总词汇量
     */
    getTotalWordCount() {
        return this.totalWords;
    }

    /**
     * 获取最后更新时间
     * @returns {Date} - 最后更新时间
     */
    getLastUpdateTime() {
        return this.lastUpdate;
    }
}

// 创建全局实例
window.vocabularyManager = new VocabularyManager();