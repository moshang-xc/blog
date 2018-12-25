## vue-flip-game
vue + vuex 开发的简单的翻牌记忆游戏

## 克隆代码到本地

```
#clone
git clone https://github.com/moshang-xc/vue-flip-game.git
cd vue-flip-game

#安装依赖
npm install

#run debug server
npm start

#生产环境
npm run build

```

## 目录结构 ##

```
vue-flip-game
├── css
│   └── main.css
├── img
│   └── favicon.ico
├── js
│   ├── components
│   │   ├── box
│   │   │   └── Success.vue
│   │   ├── card
│   │   │   ├── Card.vue
│   │   │   └── Cardboard.vue
│   │   ├── Statusboard
│   │   │   ├── BestScore.vue
│   │   │   ├── Logo.vue
│   │   │   ├── MatchInfo.vue
│   │   │   ├── MatchScore.vue
│   │   │   ├── MatchAction.vue
│   │   │   └── StatusBoard.vue
│   │   └── Flip.vue
│   ├── lib
|   |   └── mixArray.js
│   ├── vuex
│   │   ├── actions
│   │   │   └── index.js
│   │   ├── getters
│   │   │   └── index.js
│   │   ├── mutations
│   │   │   └── index.js
│   │   └── store
│   │       ├── index.js
│   │       └── statusEnum.js
│   │
│   └── index.js
│
├── index.html_vm
├── package.json
├── webpack.config.js
└── webpack.config.prod.js
```

