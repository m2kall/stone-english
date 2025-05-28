/**
 * 词汇生成器
 * 用于生成大量词汇数据
 */
const WordGenerator = {
    // 常用词汇分类
    categories: {
        animals: ['cat', 'dog', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'duck', 'rabbit', 'mouse', 'elephant', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer'],
        food: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'bread', 'rice', 'meat', 'fish', 'chicken', 'beef', 'pork', 'vegetable', 'carrot', 'potato', 'tomato', 'onion', 'garlic', 'milk', 'cheese'],
        colors: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'silver', 'gold', 'violet', 'indigo', 'turquoise', 'maroon', 'navy', 'lime', 'olive'],
        family: ['father', 'mother', 'son', 'daughter', 'brother', 'sister', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'husband', 'wife', 'parent', 'child', 'baby', 'adult', 'teenager'],
        body: ['head', 'face', 'eye', 'nose', 'mouth', 'ear', 'hair', 'neck', 'shoulder', 'arm', 'hand', 'finger', 'chest', 'back', 'stomach', 'leg', 'foot', 'toe', 'knee', 'elbow'],
        clothes: ['shirt', 'pants', 'dress', 'skirt', 'jacket', 'coat', 'shoes', 'socks', 'hat', 'cap', 'gloves', 'scarf', 'belt', 'tie', 'sweater', 'jeans', 'shorts', 'underwear', 'pajamas', 'uniform'],
        house: ['house', 'room', 'kitchen', 'bedroom', 'bathroom', 'living room', 'dining room', 'garage', 'garden', 'door', 'window', 'wall', 'floor', 'ceiling', 'roof', 'stairs', 'furniture', 'table', 'chair', 'bed'],
        school: ['school', 'teacher', 'student', 'classroom', 'book', 'pen', 'pencil', 'paper', 'desk', 'chair', 'blackboard', 'computer', 'lesson', 'homework', 'test', 'exam', 'grade', 'subject', 'math', 'science'],
        work: ['work', 'job', 'office', 'company', 'boss', 'employee', 'manager', 'secretary', 'meeting', 'project', 'task', 'deadline', 'salary', 'career', 'profession', 'business', 'customer', 'client', 'service', 'product'],
        transport: ['car', 'bus', 'train', 'plane', 'ship', 'boat', 'bicycle', 'motorcycle', 'taxi', 'subway', 'truck', 'van', 'helicopter', 'rocket', 'road', 'street', 'highway', 'bridge', 'tunnel', 'station']
    },

    // 词汇释义映射
    meaningMap: {
        'apple': '苹果',
        'banana': '香蕉',
        'orange': '橙子',
        'grape': '葡萄',
        'strawberry': '草莓',
        'cat': '猫',
        'dog': '狗',
        'bird': '鸟',
        'fish': '鱼',
        'horse': '马',
        'red': '红色',
        'blue': '蓝色',
        'green': '绿色',
        'yellow': '黄色',
        'black': '黑色',
        'father': '父亲',
        'mother': '母亲',
        'son': '儿子',
        'daughter': '女儿',
        'brother': '兄弟',
        'head': '头',
        'face': '脸',
        'eye': '眼睛',
        'nose': '鼻子',
        'mouth': '嘴',
        'shirt': '衬衫',
        'pants': '裤子',
        'dress': '连衣裙',
        'skirt': '裙子',
        'jacket': '夹克',
        'house': '房子',
        'room': '房间',
        'kitchen': '厨房',
        'bedroom': '卧室',
        'bathroom': '浴室',
        'school': '学校',
        'teacher': '老师',
        'student': '学生',
        'classroom': '教室',
        'book': '书',
        'work': '工作',
        'job': '职业',
        'office': '办公室',
        'company': '公司',
        'boss': '老板',
        'car': '汽车',
        'bus': '公交车',
        'train': '火车',
        'plane': '飞机',
        'ship': '船',
        'walk': '走路',
        'run': '跑步',
        'jump': '跳跃',
        'swim': '游泳',
        'eat': '吃',
        'drink': '喝',
        'sleep': '睡觉',
        'read': '阅读',
        'write': '写',
        'listen': '听',
        'speak': '说话',
        'watch': '观看',
        'big': '大的',
        'small': '小的',
        'tall': '高的',
        'short': '短的',
        'long': '长的',
        'new': '新的',
        'old': '旧的',
        'good': '好的',
        'bad': '坏的',
        'hot': '热的',
        'cold': '冷的',
        'warm': '温暖的',
        'cool': '凉爽的',
        'fast': '快的',
        'slow': '慢的',
        'happy': '快乐的',
        'sad': '悲伤的',
        'angry': '生气的',
        'tired': '疲惫的',
        'hungry': '饥饿的',
        'thirsty': '口渴的'
    },

    // 音标映射
    phoneticMap: {
        'apple': '/ˈæpəl/',
        'banana': '/bəˈnænə/',
        'orange': '/ˈɔːrɪndʒ/',
        'cat': '/kæt/',
        'dog': '/dɔːɡ/',
        'bird': '/bɜːrd/',
        'fish': '/fɪʃ/',
        'red': '/red/',
        'blue': '/bluː/',
        'green': '/ɡriːn/',
        'yellow': '/ˈjeloʊ/',
        'black': '/blæk/',
        'white': '/waɪt/',
        'father': '/ˈfɑːðər/',
        'mother': '/ˈmʌðər/',
        'house': '/haʊs/',
        'school': '/skuːl/',
        'book': '/bʊk/',
        'work': '/wɜːrk/',
        'car': '/kɑːr/',
        'big': '/bɪɡ/',
        'small': '/smɔːl/',
        'good': '/ɡʊd/',
        'bad': '/bæd/',
        'happy': '/ˈhæpi/',
        'water': '/ˈwɔːtər/',
        'food': '/fuːd/',
        'time': '/taɪm/',
        'people': '/ˈpiːpəl/',
        'day': '/deɪ/',
        'year': '/jɪr/',
        'way': '/weɪ/',
        'man': '/mæn/',
        'woman': '/ˈwʊmən/',
        'child': '/tʃaɪld/',
        'life': '/laɪf/',
        'world': '/wɜːrld/',
        'hand': '/hænd/',
        'part': '/pɑːrt/',
        'place': '/pleɪs/',
        'case': '/keɪs/',
        'week': '/wiːk/',
        'company': '/ˈkʌmpəni/',
        'system': '/ˈsɪstəm/',
        'program': '/ˈproʊɡræm/',
        'question': '/ˈkwestʃən/',
        'number': '/ˈnʌmbər/',
        'point': '/pɔɪnt/',
        'government': '/ˈɡʌvərnmənt/',
        'area': '/ˈeriə/',
        'money': '/ˈmʌni/',
        'story': '/ˈstɔːri/',
        'fact': '/fækt/',
        'month': '/mʌnθ/',
        'lot': '/lɑːt/',
        'right': '/raɪt/',
        'study': '/ˈstʌdi/',
        'job': '/dʒɑːb/',
        'word': '/wɜːrd/',
        'business': '/ˈbɪznəs/',
        'issue': '/ˈɪʃuː/',
        'side': '/saɪd/',
        'kind': '/kaɪnd/',
        'head': '/hed/',
        'house': '/haʊs/',
        'service': '/ˈsɜːrvəs/',
        'friend': '/frend/',
        'father': '/ˈfɑːðər/',
        'power': '/ˈpaʊər/',
        'hour': '/ˈaʊər/',
        'game': '/ɡeɪm/',
        'line': '/laɪn/',
        'end': '/end/',
        'member': '/ˈmembər/',
        'law': '/lɔː/',
        'car': '/kɑːr/',
        'city': '/ˈsɪti/',
        'community': '/kəˈmjuːnəti/',
        'name': '/neɪm/',
        'president': '/ˈprezɪdənt/',
        'team': '/tiːm/',
        'minute': '/ˈmɪnɪt/',
        'idea': '/aɪˈdiə/',
        'kid': '/kɪd/',
        'body': '/ˈbɑːdi/',
        'information': '/ˌɪnfərˈmeɪʃən/',
        'back': '/bæk/',
        'parent': '/ˈperənt/',
        'face': '/feɪs/',
        'others': '/ˈʌðərz/',
        'level': '/ˈlevəl/',
        'office': '/ˈɔːfəs/',
        'door': '/dɔːr/',
        'health': '/helθ/',
        'person': '/ˈpɜːrsən/',
        'art': '/ɑːrt/',
        'war': '/wɔːr/',
        'history': '/ˈhɪstəri/',
        'party': '/ˈpɑːrti/',
        'result': '/rɪˈzʌlt/',
        'change': '/tʃeɪndʒ/',
        'morning': '/ˈmɔːrnɪŋ/',
        'reason': '/ˈriːzən/',
        'research': '/rɪˈsɜːrtʃ/',
        'girl': '/ɡɜːrl/',
        'guy': '/ɡaɪ/',
        'moment': '/ˈmoʊmənt/',
        'air': '/er/',
        'teacher': '/ˈtiːtʃər/',
        'force': '/fɔːrs/',
        'education': '/ˌedʒuˈkeɪʃən/'
    },

    // 同义词映射
    synonymMap: {
        'big': ['large', 'huge', 'enormous', 'giant', 'massive'],
        'small': ['little', 'tiny', 'miniature', 'petite', 'compact'],
        'good': ['excellent', 'great', 'wonderful', 'fantastic', 'amazing'],
        'bad': ['terrible', 'awful', 'horrible', 'dreadful', 'poor'],
        'happy': ['joyful', 'cheerful', 'delighted', 'pleased', 'glad'],
        'sad': ['unhappy', 'sorrowful', 'depressed', 'melancholy', 'gloomy'],
        'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty'],
        'slow': ['sluggish', 'gradual', 'leisurely', 'unhurried', 'delayed'],
        'beautiful': ['pretty', 'lovely', 'attractive', 'gorgeous', 'stunning'],
        'ugly': ['unattractive', 'hideous', 'unsightly', 'repulsive', 'grotesque'],
        'smart': ['intelligent', 'clever', 'bright', 'brilliant', 'wise'],
        'stupid': ['foolish', 'silly', 'dumb', 'ignorant', 'ridiculous'],
        'rich': ['wealthy', 'affluent', 'prosperous', 'well-off', 'loaded'],
        'poor': ['needy', 'impoverished', 'broke', 'destitute', 'penniless'],
        'strong': ['powerful', 'mighty', 'robust', 'sturdy', 'tough'],
        'weak': ['feeble', 'frail', 'fragile', 'delicate', 'vulnerable'],
        'easy': ['simple', 'effortless', 'straightforward', 'uncomplicated', 'basic'],
        'difficult': ['hard', 'challenging', 'tough', 'complex', 'complicated'],
        'hot': ['warm', 'heated', 'scorching', 'boiling', 'burning'],
        'cold': ['cool', 'chilly', 'freezing', 'icy', 'frigid']
    },

    // 反义词映射
    antonymMap: {
        'big': ['small', 'little', 'tiny'],
        'small': ['big', 'large', 'huge'],
        'good': ['bad', 'terrible', 'awful'],
        'bad': ['good', 'excellent', 'great'],
        'happy': ['sad', 'unhappy', 'sorrowful'],
        'sad': ['happy', 'joyful', 'cheerful'],
        'hot': ['cold', 'cool', 'freezing'],
        'cold': ['hot', 'warm', 'heated'],
        'fast': ['slow', 'sluggish', 'gradual'],
        'slow': ['fast', 'quick', 'rapid'],
        'new': ['old', 'ancient', 'aged'],
        'old': ['new', 'fresh', 'modern'],
        'light': ['dark', 'heavy'],
        'dark': ['light', 'bright'],
        'up': ['down', 'below'],
        'down': ['up', 'above'],
        'in': ['out', 'outside'],
        'out': ['in', 'inside'],
        'day': ['night', 'evening'],
        'night': ['day', 'morning'],
        'yes': ['no'],
        'no': ['yes'],
        'open': ['close', 'shut'],
        'close': ['open'],
        'start': ['stop', 'end', 'finish'],
        'stop': ['start', 'begin'],
        'love': ['hate', 'dislike'],
        'hate': ['love', 'like'],
        'rich': ['poor', 'broke'],
        'poor': ['rich', 'wealthy'],
        'strong': ['weak', 'frail'],
        'weak': ['strong', 'powerful']
    },

    // 生成完整词汇数据
    generateVocabularyData() {
        const allWords = [];
        let id = 1;

        // 基础分类词汇
        Object.entries(this.categories).forEach(([category, words]) => {
            words.forEach(word => {
                allWords.push(this.createWordObject(id++, word, category));
            });
        });

        // 高频词汇
        allWords.push(...this.getHighFrequencyWords(id));
        id += 100;

        // 学术词汇
        allWords.push(...this.getAcademicWords(id));
        id += 100;

        // 商务词汇
        allWords.push(...this.getBusinessWords(id));
        id += 100;

        // 动词词汇
        allWords.push(...this.getVerbWords(id));
        id += 100;

        // 形容词词汇
        allWords.push(...this.getAdjectiveWords(id));
        id += 100;

        // 考试词汇
        allWords.push(...this.getExamWords(id));

        return allWords;
    },

    // 创建词汇对象
    createWordObject(id, word, category, level = null) {
        return {
            id: id,
            word: word,
            category: category,
            level: level || this.determineLevel(word),
            frequency: this.calculateFrequency(word),
            phonetic: this.getPhonetic(word),
            meaning: this.getMeaning(word),
            example: this.getExample(word),
            synonyms: this.getSynonyms(word),
            antonyms: this.getAntonyms(word),
            partOfSpeech: this.getPartOfSpeech(word, category)
        };
    },

    // 获取高频词汇
    getHighFrequencyWords(startId) {
        const highFreqWords = [
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will',
            'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
            'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
            'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
            'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
            'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
            'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
            'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'water', 'long'
        ];

        return highFreqWords.map((word, index) => 
            this.createWordObject(startId + index, word, 'high-frequency', 'basic')
        );
    },

    // 获取学术词汇
    getAcademicWords(startId) {
        const academicWords = [
            'analyze', 'approach', 'area', 'assessment', 'assume', 'authority', 'available',
            'benefit', 'concept', 'consistent', 'constitutional', 'context', 'contract', 'create',
            'data', 'definition', 'derived', 'distribution', 'economic', 'environment', 'established',
            'estimate', 'evidence', 'export', 'factors', 'financial', 'formula', 'function',
            'identified', 'income', 'indicate', 'individual', 'interpretation', 'involved', 'issues',
            'labor', 'legal', 'legislation', 'major', 'method', 'occur', 'percent', 'period',
            'policy', 'principle', 'procedure', 'process', 'required', 'research', 'response',
            'role', 'section', 'significant', 'similar', 'source', 'specific', 'structure',
            'theory', 'variables', 'academic', 'acquire', 'administrative', 'affect', 'alternative',
            'appropriate', 'approximately', 'aspects', 'assistance', 'categories', 'chapter',
            'commission', 'community', 'complex', 'computer', 'conclusion', 'conduct', 'consequences',
            'construction', 'consumer', 'credit', 'cultural', 'design', 'distinction', 'elements',
            'equation', 'evaluation', 'features', 'final', 'focus', 'impact', 'injury', 'institute',
            'investment', 'items', 'journal', 'maintenance', 'normal', 'obtained', 'participation',
            'perceived', 'positive', 'potential', 'previous', 'primary', 'purchase', 'range',
            'region', 'regulations', 'relevant', 'resident', 'resources', 'restricted', 'security',
            'sought', 'statistics', 'strategies', 'survey', 'text', 'traditional', 'transfer'
        ];

        return academicWords.map((word, index) => 
            this.createWordObject(startId + index, word, 'academic', 'advanced')
        );
    },

    // 获取商务词汇
    getBusinessWords(startId) {
        const businessWords = [
            'account', 'achieve', 'agreement', 'amount', 'analysis', 'annual', 'application',
            'appointed', 'asset', 'board', 'budget', 'building', 'business', 'capital',
            'career', 'cash', 'client', 'commercial', 'committee', 'communication', 'company',
            'competition', 'competitive', 'complete', 'contract', 'control', 'cooperation',
            'corporate', 'cost', 'create', 'customer', 'decision', 'delivery', 'department',
            'development', 'director', 'distribution', 'division', 'economic', 'economy',
            'employee', 'employment', 'equipment', 'establish', 'executive', 'experience',
            'export', 'facilities', 'finance', 'financial', 'firm', 'function', 'growth',
            'import', 'improve', 'increase', 'industrial', 'industry', 'information',
            'insurance', 'international', 'investment', 'issue', 'management', 'manager',
            'manufacture', 'market', 'marketing', 'meeting', 'mission', 'negotiate',
            'operation', 'opportunity', 'order', 'organization', 'payment', 'performance',
            'plan', 'policy', 'price', 'process', 'produce', 'product', 'production',
            'profit', 'project', 'promote', 'proposal', 'purchase', 'quality', 'report',
            'result', 'revenue', 'sale', 'service', 'strategy', 'success', 'supply',
            'technology', 'trade', 'training', 'transport'
        ];

        return businessWords.map((word, index) => 
            this.createWordObject(startId + index, word, 'business', 'intermediate')
        );
    },

    // 获取动词词汇
    getVerbWords(startId) {
        const verbWords = [
            'accept', 'achieve', 'add', 'agree', 'allow', 'appear', 'apply', 'ask',
            'become', 'begin', 'believe', 'bring', 'build', 'buy', 'call', 'carry',
            'change', 'choose', 'come', 'consider', 'continue', 'create', 'cut',
            'decide', 'develop', 'die', 'draw', 'drive', 'eat', 'end', 'expect',
            'explain', 'fall', 'feel', 'find', 'follow', 'forget', 'give', 'grow',
            'happen', 'hear', 'help', 'hold', 'include', 'increase', 'keep', 'kill',
            'know', 'learn', 'leave', 'let', 'live', 'look', 'lose', 'love',
            'make', 'mean', 'meet', 'move', 'need', 'open', 'pay', 'play',
            'provide', 'put', 'reach', 'read', 'receive', 'remain', 'remember',
            'return', 'run', 'say', 'see', 'seem', 'sell', 'send', 'serve',
            'show', 'sit', 'speak', 'spend', 'stand', 'start', 'stay', 'stop',
            'study', 'suggest', 'take', 'talk', 'teach', 'tell', 'think', 'try',
            'turn', 'understand', 'use', 'wait', 'walk', 'want', 'watch', 'win',
            'work', 'write'
        ];

        return verbWords.map((word, index) => 
            this.createWordObject(startId + index, word, 'verbs', 'basic')
        );
    },

    // 获取形容词词汇
    getAdjectiveWords(startId) {
        const adjectiveWords = [
            'able', 'active', 'actual', 'available', 'bad', 'beautiful', 'best',
            'better', 'big', 'black', 'blue', 'brown', 'clear', 'cold', 'common',
            'complete', 'current', 'different', 'difficult', 'early', 'easy',
            'economic', 'entire', 'environmental', 'equal', 'excellent', 'fast',
            'federal', 'few', 'final', 'fine', 'free', 'full', 'general', 'good',
            'great', 'green', 'happy', 'hard', 'heavy', 'high', 'hot', 'huge',
            'human', 'important', 'international', 'large', 'last', 'late', 'legal',
            'little', 'local', 'long', 'low', 'major', 'medical', 'military',
            'modern', 'national', 'natural', 'necessary', 'new', 'nice', 'old',
            'only', 'open', 'other', 'physical', 'political', 'poor', 'popular',
            'possible', 'present', 'private', 'professional', 'public', 'real',
            'recent', 'red', 'religious', 'right', 'safe', 'same', 'serious',
            'several', 'short', 'significant', 'similar', 'simple', 'small',
            'social', 'special', 'specific', 'strong', 'successful', 'true',
            'various', 'white', 'whole', 'wide', 'wonderful', 'wrong', 'young'
        ];

        return adjectiveWords.map((word, index) => 
            this.createWordObject(startId + index, word, 'adjectives', 'intermediate')
        );
    },

    // 获取考试词汇
    getExamWords(startId) {
        const examWords = [
            'abandon', 'abbreviate', 'abolish', 'abstract', 'abundant', 'accelerate',
            'accessible', 'accommodate', 'accompany', 'accomplish', 'accumulate',
            'accurate', 'acknowledge', 'acquire', 'activate', 'adapt', 'adequate',
            'adjacent', 'adjust', 'administer', 'adolescent', 'advocate', 'aesthetic',
            'affiliate', 'aggregate', 'allocate', 'alternative', 'ambiguous',
            'analyze', 'anonymous', 'anticipate', 'apparent', 'appreciate', 'arbitrary',
            'architecture', 'array', 'articulate', 'assemble', 'assert', 'assess',
            'assign', 'assume', 'assure', 'attach', 'attain', 'attribute', 'authentic',
            'authorize', 'automate', 'availability', 'behalf', 'benefit', 'bias',
            'bond', 'brief', 'bulk', 'capable', 'capacity', 'category', 'cease',
            'challenge', 'channel', 'chapter', 'chart', 'chemical', 'circumstance',
            'cite', 'civil', 'clarify', 'classic', 'clause', 'code', 'coherent',
            'coincide', 'collapse', 'colleague', 'commence', 'comment', 'commission',
            'commit', 'commodity', 'communicate', 'community', 'compatible',
            'compensate', 'compile', 'complement', 'complex', 'component', 'compound',
            'comprehensive', 'comprise', 'compute', 'conceive', 'concentrate',
            'concept', 'conclude', 'concurrent', 'conduct', 'confer', 'confine',
            'confirm', 'conflict', 'conform', 'consent', 'consequent', 'considerable',
            'consist', 'constant', 'constitute', 'constrain', 'construct', 'consult',
            'consume', 'contact', 'contain', 'contemplate', 'contemporary', 'context',
            'contract', 'contradict', 'contrary', 'contrast', 'contribute', 'controversy',
            'convene', 'convention', 'convert', 'convince', 'cooperate', 'coordinate',
            'core', 'corporate', 'correspond', 'couple', 'create', 'credit', 'criteria',
            'crucial', 'culture', 'currency', 'cycle', 'data', 'debate', 'decade',
            'decline', 'deduce', 'define', 'definite', 'demonstrate', 'denote',
            'deny', 'depress', 'derive', 'design', 'despite', 'detect', 'device',
            'devote', 'differentiate', 'dimension', 'diminish', 'discrete', 'discriminate',
            'displace', 'display', 'dispose', 'distinct', 'distort', 'distribute',
            'diverse', 'document', 'domain', 'domestic', 'dominate', 'draft', 'drama',
            'duration', 'dynamic', 'economy', 'edit', 'element', 'eliminate', 'emerge',
            'emphasis', 'empirical', 'enable', 'encounter', 'energy', 'enforce',
            'enhance', 'enormous', 'ensure', 'entity', 'environment', 'episode',
            'equation', 'equip', 'equivalent', 'erode', 'error', 'establish', 'estate',
            'estimate', 'ethnic', 'evaluate', 'eventual', 'evident', 'evolve',
            'exceed', 'exclude', 'execute', 'exhibit', 'exist', 'expand', 'expert',
            'explicit', 'exploit', 'export', 'expose', 'external', 'extract', 'facilitate',
            'factor', 'feature', 'federal', 'fee', 'file', 'final', 'finance',
            'finite', 'flexible', 'fluctuate', 'focus', 'format', 'formula',
            'forthcoming', 'foundation', 'framework', 'function', 'fund', 'fundamental',
            'furthermore', 'gender', 'generate', 'generation', 'globe', 'goal',
            'grade', 'grant', 'guarantee', 'guideline', 'hence', 'hierarchy',
            'highlight', 'hypothesis', 'identical', 'identify', 'ideology', 'ignorant',
            'illustrate', 'image', 'immigrant', 'impact', 'implement', 'implicate',
            'implicit', 'imply', 'impose', 'incentive', 'incidence', 'incline',
            'income', 'incorporate', 'index', 'indicate', 'individual', 'induce',
            'inevitable', 'infer', 'infrastructure', 'inherent', 'inhibit', 'initial',
            'initiate', 'inject', 'innovate', 'input', 'insert', 'insight', 'inspect',
            'instance', 'institute', 'instruct', 'integral', 'integrate', 'integrity',
            'intelligence', 'intense', 'interact', 'intermediate', 'internal',
            'interpret', 'interval', 'intervene', 'intrinsic', 'invest', 'investigate',
            'invoke', 'involve', 'isolate', 'issue', 'item', 'job', 'journal',
            'justify', 'label', 'labor', 'layer', 'lecture', 'legal', 'legislate',
            'levy', 'liberal', 'license', 'likewise', 'link', 'locate', 'logic',
            'maintain', 'major', 'manipulate', 'manual', 'margin', 'mature',
            'maximize', 'mechanism', 'media', 'mediate', 'medical', 'medium',
            'mental', 'method', 'migrate', 'military', 'minimal', 'minimize',
            'minimum', 'ministry', 'minor', 'mode', 'modify', 'monitor', 'motive',
            'mutual', 'negate', 'network', 'neutral', 'nevertheless', 'norm',
            'normal', 'notion', 'nuclear', 'objective', 'obtain', 'obvious',
            'occupy', 'occur', 'odd', 'offset', 'ongoing', 'option', 'orient',
            'outcome', 'output', 'overall', 'overlap',
            'overseas', 'panel', 'paradigm', 'paragraph', 'parallel', 'parameter',
            'participate', 'partner', 'passive', 'perceive', 'percent', 'period',
            'persist', 'perspective', 'phase', 'phenomenon', 'philosophy', 'physical',
            'policy', 'portion', 'pose', 'positive', 'potential', 'practitioner',
            'precede', 'precise', 'predict', 'predominant', 'preliminary', 'presume',
            'previous', 'primary', 'prime', 'principal', 'principle', 'prior',
            'priority', 'proceed', 'process', 'professional', 'prohibit', 'project',
            'promote', 'proportion', 'prospect', 'protocol', 'psychology', 'publication',
            'publish', 'purchase', 'pursue', 'qualitative', 'quote', 'radical',
            'random', 'range', 'ratio', 'rational', 'react', 'recover', 'refine',
            'regime', 'region', 'register', 'regulate', 'reinforce', 'reject',
            'relevant', 'rely', 'remove', 'require', 'research', 'reside', 'resolve',
            'resource', 'respond', 'restore', 'restrain', 'restrict', 'retain',
            'reveal', 'revenue', 'reverse', 'revise', 'revolution', 'rigid', 'role',
            'route', 'scenario', 'schedule', 'scheme', 'scope', 'section', 'sector',
            'secure', 'seek', 'select', 'sequence', 'series', 'shift', 'significant',
            'similar', 'simulate', 'site', 'so-called', 'sole', 'somewhat', 'source',
            'specific', 'specify', 'sphere', 'stable', 'statistic', 'status',
            'straightforward', 'strategy', 'stress', 'structure', 'style', 'submit',
            'subordinate', 'subsequent', 'subsidy', 'substitute', 'successor',
            'sufficient', 'sum', 'summary', 'supplement', 'survey', 'survive',
            'suspend', 'sustain', 'symbol', 'tape', 'target', 'task', 'team',
            'technical', 'technique', 'technology', 'temporary', 'tense', 'terminate',
            'text', 'theme', 'theory', 'thereby', 'thesis', 'topic', 'trace',
            'tradition', 'transfer', 'transform', 'transit', 'transmit', 'transport',
            'trend', 'trigger', 'ultimate', 'undergo', 'underlie', 'undertake',
            'uniform', 'unify', 'unique', 'utilize', 'valid', 'vary', 'vehicle',
            'version', 'via', 'violate', 'virtual', 'visible', 'vision', 'visual',
            'volume', 'voluntary', 'welfare', 'whereas', 'whereby', 'widespread',
            'withdraw'
        ];

        return examWords.map((word, index) => 
            this.createWordObject(startId + index, word, 'exam', 'advanced')
        );
    },

    // 确定词汇级别
    determineLevel(word) {
        const wordLength = word.length;
        if (wordLength <= 4) {
            return 'basic';
        } else if (wordLength <= 7) {
            return 'intermediate';
        } else {
            return 'advanced';
        }
    },

    // 计算词汇频率
    calculateFrequency(word) {
        // 简单模拟词汇频率，实际应基于语料库
        const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
                            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];
        
        if (commonWords.includes(word.toLowerCase())) {
            return Math.floor(Math.random() * 1000) + 9000; // 9000-10000
        }
        
        const wordLength = word.length;
        if (wordLength <= 4) {
            return Math.floor(Math.random() * 3000) + 6000; // 6000-9000
        } else if (wordLength <= 7) {
            return Math.floor(Math.random() * 3000) + 3000; // 3000-6000
        } else {
            return Math.floor(Math.random() * 3000); // 0-3000
        }
    },

    // 获取音标
    getPhonetic(word) {
        return this.phoneticMap[word] || `/${word}/`;
    },

    // 获取词义
    getMeaning(word) {
        return this.meaningMap[word] || `${word}的含义`;
    },

    // 获取例句
    getExample(word) {
        const examples = {
            'cat': 'The cat is sleeping on the sofa.',
            'dog': 'My dog likes to play fetch.',
            'apple': 'I eat an apple every day.',
            'banana': 'Monkeys love to eat bananas.',
            'red': 'The rose is red.',
            'blue': 'The sky is blue on a clear day.',
            'father': 'My father works in a bank.',
            'mother': 'Her mother is a doctor.',
            'house': 'They live in a big house.',
            'school': 'The children go to school by bus.',
            'work': 'I have to work late tonight.',
            'car': 'He drives a new car.',
            'big': 'They live in a big house.',
            'small': 'The mouse is a small animal.',
            'happy': 'The children look happy when they play.',
            'sad': 'She felt sad after watching the movie.'
        };
        
        return examples[word] || `This is an example sentence using the word "${word}".`;
    },

    // 获取同义词
    getSynonyms(word) {
        return this.synonymMap[word] || [];
    },

    // 获取反义词
    getAntonyms(word) {
        return this.antonymMap[word] || [];
    },

    // 获取词性
    getPartOfSpeech(word, category) {
        const categoryToPos = {
            'animals': 'noun',
            'food': 'noun',
            'colors': 'adjective',
            'family': 'noun',
            'body': 'noun',
            'clothes': 'noun',
            'house': 'noun',
            'school': 'noun',
            'work': 'noun',
            'transport': 'noun',
            'verbs': 'verb',
            'adjectives': 'adjective',
            'high-frequency': 'various',
            'academic': 'various',
            'business': 'various',
            'exam': 'various'
        };
        
        return categoryToPos[category] || 'unknown';
    }
};

// 生成词汇数据并存储在全局变量中
window.vocabularyData = WordGenerator.generateVocabularyData();