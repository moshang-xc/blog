# JavaScript简明代码

## 1. 强类型检查

使用 `===` 而不是 `==`

```js
0 === false // false
2 === "2" // false
```

## 2. 变量

### 命名

变量命名要直接表明其背后的意图。这种方式方便代码搜索并且易于他人理解。

糟糕示例：

```js
let daysSLV = 10;
let y = new Date().getFullYear();

let ok;
if (user.age > 30) {
  ok = true;
}
```

良好示例：

```js
const MAX_AGE = 30;
let daysSinceLastVisit = 10;
let currentYear = new Date().getFullYear();

...

const isUserOlderThanAllowed = user.age > MAX_AGE;
```

### 不要强制他人记住变量的上下文。

糟糕示例：

```js
const users = ["John", "Marco", "Peter"];
users.forEach(u => {
  doSomething();
  doSomethingElse();
  // ...
  // ...
  // ...
  // ...
  // 这里有 WTF 场景：`u` TM 是啥？
  register(u);
});
复制代码
```

良好示例：

```js
const users = ["John", "Marco", "Peter"];
users.forEach(user => {
  doSomething();
  doSomethingElse();
  // ...
  // ...
  // ...
  // ...
  register(user);
});
```

### 不要添加不必要的上下文。

糟糕示例：

```js
const user = {
  userName: "John",
  userSurname: "Doe",
  userAge: "28"
};

...

user.userName;
复制代码
```

良好示例：

```js
const user = {
  name: "John",
  surname: "Doe",
  age: "28"
};

...

user.name;
```

## 3. 函数

### 命名

使用长而具有描述性的名称。考虑到它代表某种行为，函数名称应该是暴露其背后意图的动词或者短语，参数也是如此。它们的名称应该表明它们要做什么。

糟糕示例：

```
function notif(user) {
  // implementation
}
复制代码
```

良好示例：

```
function notifyUser(emailAddress) {
  // implementation
}
```

### 一个函数应该只做一件事

禁止在单个函数中执行多个操作。

糟糕示例：

```
function notifyUsers(users) {
  users.forEach(user => {
    const userRecord = database.lookup(user);
    if (userRecord.isVerified()) {
      notify(user);
    }
  });
}
复制代码
```

良好示例：

```
function notifyVerifiedUsers(users) {
  users.filter(isUserVerified).forEach(notify);
}

function isUserVerified(user) {
  const userRecord = database.lookup(user);
  return userRecord.isVerified();
}
```

### 不要使用标志变量作为参数

因为这表明函数做了它不应该做的事。

糟糕示例：

```
function createFile(name, isPublic) {
  if (isPublic) {
    fs.create(`./public/${name}`);
  } else {
    fs.create(name);
  }
}
复制代码
```

良好示例：

```
function createFile(name) {
  fs.create(name);
}

function createPublicFile(name) {
  createFile(`./public/${name}`);
}
复制代码
```

## 4. 条件语句

避免使用否定条件

# 5. 通用原则

你应该尽力不要重复自己的工作，意思是你不应该写重复代码，并且不要在你身后留下尾巴比如未使用的函数和死代码。

出于各种原因，你最终可能会遇到重复的代码。例如，你有两个大致相同只有些许不同的东西，它们不同的特性或者时间紧迫使你单独创建了两个包含几乎相同代码的函数。在这种情况下删除重复代码意味着抽象化差异并在该层级上处理它们。删除无用的代码，