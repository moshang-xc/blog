# npm 更改为淘宝镜像的方法


## 1、命令行临时使用指定镜像（淘宝）

```
npm --registry https://registry.npm.taobao.org install express
```

## 2、命令行永久更改使用指定镜像（淘宝）

```
npm config set registry https://registry.npm.taobao.org
```
> 以后 `npm install express` 默认使用指定（淘宝）镜像

设置回原版本
```
npm config set registry http://registry.npmjs.org 
```

## 3、使用淘宝 NPM 镜像（参考 [http://www.runoob.com/nodejs/nodejs-npm.html](http://www.runoob.com/nodejs/nodejs-npm.html)）

命令行输入 
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
这样就可以使用 `cnpm` 命令来安装模块了： `cnpm install express`

查看目前使用的npm镜像的方法：
```
npm config get registry
```
