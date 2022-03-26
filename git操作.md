# GIT

## 指令

```bas
# 查看文件内容
cat 文件名

# 编辑文件
vi 文件名
```

## 配置

```bash
# 查看所有配置信息
git config --list

# 查看用户名、邮箱
git config user.name
git config user.email

# 修改用户名、邮箱
git config --global user.name "moshang-xc"
git config --global user.email "755172990@qq.com"
git config --global user.name "xiechang"
git config --global user.email "xiechang@tenda.cn"
```

## 分支

```bash
# 列出所有本地分支
git branch

# 列出所有本地分支和远程分支
git branch -a

# 创建分支
git branch xxx

# 切换分支
git checkout xxx

# 创建并切换分支
git checkout -b xxxx

# 删除分支，前提是该分支没有未合并的变动
git branch -d <分支名>

# 强制删除分支
git branch -D <分支名>
```

## 本地分支与远程仓库

```bash
# 本地仓库关联到远程新建仓库
git remote add origin 远程仓库地址
git push -u orign master

# 提交本地分支到远程仓库
git push origin 本地分支名

# 提交新建本地分支到远程
git push origin 本地分支名:远程分支名

# 新建本地分支与远程已存在分支关联
git branch –set-upstream 本地新建分支名 origin/远程分支名
git fetch origin feature-AU-ui-xc:feature-AU-ui-xc
```

## clone 

```bash
# clone master
git clone git地址

# 直接clone远程某个分支到本地（第一次clone且未clone主分支）
git clone -b 分支 git地址

# 从远程仓库里拉取一条本地不存在的分支时：
git fetch // 拉取远程分支信息
git checkout -b 本地分支名 origin/远程分支名
```

## delete

```bash
# 删除本地分支
git branch -d 本地分支名
git branch -D 本地分支名(强制删除)

# 删除远程分支
git push origin -d 远程分支名
```

## merge

```bash
# 合并某分支到当前分支
git merge 分支名
```

## log

```bash
# 打印log
git log 

# 一行显示log
git log --oneline

# 列出某个文件的版本历史，包括文件改名
git log --follow [file]
```

## add

```bash
# 将指定文件放入暂存区
git add <file>

# 将制定目录下所有修改放入暂存区
git add <directory>

# 将当前目录下所有变化的文件，放入暂存区
git add .

# -u参数表示只添加暂存区已有的文件（包括删除操作），但不添加新增的文件
git add -u

# -f参数表示强制添加某个文件，不管.gitignore是否包含了这个文件
git add -f <fileName>

# -A 和 --all .等价
git add . == git add -A == git add --all
```

## commit

```bash
# 提交
git commit -m "log"

# 追加提交/修改提交
git commit --amend 

# 跳过暂存区，直接将文件从工作区提交到仓库区
git commit <filename> -m "log"

# 用于没有提交信息的 commit。
git commit --allow-empty

# 修改最近一条log
git commit --amend
## or
git commit --amend -m "log"
```

## stash 

```bash
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注的内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近一次的stash
git stash apply

# 应用最近一次的stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop
```

> 当当前分支代码在暂存后提交了修改，此时恢复暂存的代码，如果涉及到修改同一文件，可能会触发冲突

## reset 

### reset --hard 

```bash
# 回退最近一次的提交记录，删除最近一次的修改
git reset --hard HEAD^

# 回退到commit-hash对应的那个版本，版本之后的所有提交全部删除
git reset --hard commit-hash
```

### reset --soft

```bash
# 回退最近一次的修改，并将commit的修改内容放回到暂存区
git reset --soft HEAD^

# 回退到commit-hash对应的那个版本，并将commit-hash之后的修改内容放回到暂存区
git reset --soft commit-hash
```

## reflog

当使用`reset --hard`强制回退时搞错hash值，导致回退多了，删掉了一些不该删掉的提交，这时可以通过`reflog`查看历史记录，找到正确的hash，重新reset

```bas
git log 
git reset --hard xxxx
git reflog
# 查找正确的commit hash
git reset --hard xxxx
```







# 下载单个文件夹

- 先进入到你要存放的路径

  `mkdir demo`

  ` cd demo

- 创建一个空的本地仓库

  `git init`

- 连接远程仓库GitHub

  `$ git remote add -f origin <url>`

  然后控制台会显示一些updating...信息。注意，这里的url必须是.git结尾的。

- 开启sparse checkout 模式

  `$ git config core.sparsecheckout true`

> Git1.7.0以后加入了Sparse Checkout模式，这使得Check Out指定文件或者文件夹成为可能。

- 告诉Git哪些文件或者文件夹是你真正想Check Out的
   `$ echo 你需要下载的文件夹在github上的路径 >> .git/info/sparse-checkout`
   如果有多个文件夹就添加多次

- 最后一步，拉取想要的分支

  `$ git pull origin master`

https://www.jianshu.com/p/74a0441ed9b7