# npm 相关操作

## npm 更改为淘宝镜像的方法

### 1、命令行临时使用指定镜像（淘宝）

```
npm --registry https://registry.npm.taobao.org install express
```

### 2、命令行永久更改使用指定镜像（淘宝）

```
npm config set registry https://registry.npm.taobao.org
```
> 以后 `npm install express` 默认使用指定（淘宝）镜像

设置回原版本，通常`npm publish`时需要设置回原镜像
```
npm config set registry http://registry.npmjs.org 
```

### 3、使用CNPM镜像

命令行输入 
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
这样就可以使用 `cnpm` 命令来安装模块了： `cnpm install express`

> 推荐使用方法2更改使用指定的镜像，使用cnpm会有一些奇奇怪怪的问题

## 查看目前使用的npm镜像的方法
```
npm config get registry
```

## 修改package.json本版号
指令：
- major：主版本号
- minor：次版本号
- patch：补丁号

```
version: 1.1.1

# 补丁号 + 1
npm version patch  // 1.1.2

# 次版本号 + 1
npm version minor // 1.2.1

# 主版本号 + 1
npm version major // 2.1.1
```

