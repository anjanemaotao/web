// Talismans data and effects
const talismansData = {
  // Effects for each talisman
  effects: {
    '驱邪缚魅符': '人逢此年，宜注意勿远行，守平安，否则易招倒霉、口舌、是非、损伤、受人陷害或环境职业上不良之改变，严重则有官讼牢之虑，故宜用驱邪缚魅符制化，方能避凶趋吉。',
    '除秽养神符': '人逢此年，宜注意卫生，不宜探病，小心愁闷身厄灾。勿入病人家，勿探病，勿食丧物品。犯者，则以此除秽养神符和药物化饮，病较快治愈。',
    '白虎消灾符': '人逢此年，宜注意血光意外灾、家运、不和睦、伤人口、强烈破财、官事等不测凶事。有喜可破灾，无喜百事来。故犯者，宣用白虎消灾符及三性祭送，可保安宁。',
    '保命护身符': '人逢此年，宜注意勿观丧礼，勿探看病人，切恐易遭官灾、刑罚、诉讼、争讼、争斗、受伤、破财及精神上痛苦等之不吉事，宜用保命护身符及银纸焚化，确保平安无事。',
    '太岁护佑符': '人逢此年，宜防欠安、破财、盗贼、火劫，凡事欠吉，麻烦多事，安分守己，忍耐谦让为美，宜用太岁护佑符制化，拜神叩祈，可保阖家平安。',
    '五鬼卫护符': '人逢此年，宜注意小人是非，无故平地风波起，易招阴邪、怪疾、官讼、牢狱、破财之灾，交友谨慎防暗害，故须以五鬼卫护符合同银纸焚化，反有五鬼助财运并带来好运。',
    '金光神卫符': '人逢此年，虚花不聚财，宜注意人物之走失，休管他人事，与人冲突不和，是非破财，并防家庭风波，宜用金光神卫符合金纸焚化，每月二十七日白天，向东方叩拜太阳星君，即可保平安。',
    '祛邪保真符': '人逢此年，宣注意孝服临身，勿探病，勿观丧礼，有破财及亲友重疾、伤亡之坏消息。为防灾祸，宜用祛邪保真符制化，保平安。',
    '太阴纳福符': '人逢此年，宜注意欠安、口舌、仇恨、风波、深夜不走暗路，且事多纠缠，尤其要注意因异性引起破财、纠纷事，故宜用太阴纳福符合金纸焚化，每月阴历二十六日夜晚，向西叩拜太阴星君，保平安。',
    '太岁符': '人逢此年，需请此太岁符供奉，以求平安无事，工商利兴，五谷丰收，六畜兴旺，万事如意，福运亨通。',
    '福德符': '人逢此年，用此符可得福德与善缘，趋吉避凶。',
    '龙德符': '人逢此年，用此符可得龙神护佑，消灾纳福，万事如意。'
  },
  
  // Get fortune class based on fortune level
  getFortuneClass: function(fortuneLevel) {
    const classMap = {
      'greatFortune': 'great-fortune',
      'goodFortune': 'good-fortune',
      'badFortune': 'bad-fortune',
      'terribleFortune': 'terrible-fortune',
      'extreme': 'terrible-fortune'
    };
    
    return classMap[fortuneLevel] || '';
  },
  
  // Get talisman image URL based on talisman name
  getTalismanImageUrl: function(talismanName) {
    // Use the provided talisman image asset
    return 'https://app.trickle.so/storage/public/images/usr_0d96761d70000001/15ffaba6-281f-4d53-8dd0-bd61ef284f68.webp';
  },
  
  // Play talisman animation
  playTalismanAnimation: function(callback) {
    const container = document.createElement('div');
    container.className = 'animation-container';
    container.style.display = 'block';
    document.body.appendChild(container);
    
    // Create central talisman
    const talisman = document.createElement('div');
    talisman.className = 'talisman';
    talisman.style.left = '50%';
    talisman.style.top = '50%';
    container.appendChild(talisman);
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'energy-particle';
        
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        const tx = (Math.random() - 0.5) * window.innerWidth;
        const ty = (Math.random() - 0.5) * window.innerHeight;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        particle.style.animation = `particleAnimation ${Math.random() * 2 + 1}s linear forwards`;
        
        container.appendChild(particle);
      }, i * 20);
    }
    
    // Create flying symbols
    const symbols = ['卦', '符', '命', '运', '道', '法', '灵', '德'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const symbol = document.createElement('div');
        symbol.className = 'flying-symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        symbol.style.left = `${window.innerWidth / 2}px`;
        symbol.style.top = `${window.innerHeight / 2}px`;
        symbol.style.setProperty('--rotate', `${Math.random() * 360}deg`);
        
        symbol.style.animation = `symbolAnimation ${Math.random() * 1.5 + 1}s linear forwards`;
        
        container.appendChild(symbol);
      }, i * 100 + 500);
    }
    
    // Hide animation container after animation completes and run callback
    setTimeout(() => {
      container.style.display = 'none';
      container.remove();
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, 3000);
  }
};
