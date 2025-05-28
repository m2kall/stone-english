/**
 * 词汇管理器
 * 负责词汇数据的加载、管理和处理
 */
class VocabularyManager {
    constructor() {
        this.apiSources = [
            'https://api.dictionaryapi.dev/api/v2/entries/en/'
        ];
        this.localCache = new Map();
        this.onlineWords = [];
        this.isInitialized = false;
        this.lastUpdate = new Date();
        this.totalWords = 0;
    }

    /**
     * 初始化词汇表（仅在线词库）
     */
    async initialize() {
        if (this.isInitialized) return;
        try {
            await this.loadOnlineWordList();
            this.isInitialized = true;
            this.lastUpdate = new Date();
            this.totalWords = this.onlineWords.length;
            console.log('Vocabulary manager initialized with online word list');
        } catch (error) {
            console.error('Error initializing vocabulary manager:', error);
        }
    }

    /**
     * 加载在线单词表
     */
    async loadOnlineWordList() {
        const url = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';
        const res = await fetch(url);
        const text = await res.text();
        this.onlineWords = text.split('\n').filter(Boolean);
    }

    /**
     * 获取总词汇量
     * @returns {number}
     */
    getTotalWordCount() {
        return this.onlineWords.length;
    }

    /**
     * 获取随机单词
     * @param {number} count - 数量
     * @returns {Array} - 单词数组
     */
    getRandomWords(count = 10) {
        if (!this.onlineWords.length) return [];
        const shuffled = [...this.onlineWords].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count).map(word => ({ word }));
    }

    /**
     * 搜索词汇（仅支持单词本身模糊匹配，释义需API查）
     * @param {string} query
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async searchWords(query, limit = 20) {
        if (!query || query.trim() === '') return [];
        query = query.toLowerCase().trim();
        // 只在单词本身里模糊查找
        let results = this.onlineWords.filter(word => word.toLowerCase().includes(query));
        results = results.slice(0, limit);
        // 查API补充释义
        const detailed = await Promise.all(results.map(async w => {
            const apiWord = await this.getWordDetails(w);
            return apiWord || { word: w };
        }));
        return detailed;
    }

    /**
     * 获取每日词汇（随机）
     * @param {string} level - 忽略，仅为兼容
     * @param {number} count
     * @returns {Array}
     */
    getDailyWords(level = 'basic', count = 10) {
        return this.getRandomWords(count);
    }

    /**
     * 从在线API获取词汇详情
     * @param {string} word
     * @returns {Promise<Object>}
     */
    async getWordDetails(word) {
        if (this.localCache.has(word)) {
            return this.localCache.get(word);
        }
        try {
            const response = await fetch(`${this.apiSources[0]}${word}`);
            if (response.ok) {
                const data = await response.json();
                const wordData = this.parseApiResponse(data[0]);
                this.localCache.set(word, wordData);
                return wordData;
            }
        } catch (error) {
            console.warn(`Failed to fetch details for ${word}:`, error);
        }
        return { word };
    }

    /**
     * 解析API响应
     * @param {Object} data
     * @returns {Object}
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
}

// 创建全局实例
window.vocabularyManager = new VocabularyManager();