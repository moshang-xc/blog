# Git 操作命令 

- 显示当前目录路径：`pwd` 
- 切换到d盘：`cd d` 
- 后退到上一级目录：`cd ..` 
- 把这个目录变成Git可以管理的仓库：`git init` 
- 显示当前路径下面的文件：`ls` 
- 显示当前路径下面的文件包括隐藏文件：`ls -as`
- 把文件添加到git仓库暂存区：`git add xx.xx` 
- 提交暂存区文件：`git commit -m "wrote a readme file"`（-m后面输入的是本次提交的说明，commit一次可以提交多个文件）
- 检查仓库文件状态 是否被修改等：`git status` 
- 比较版本差别：`git diff HEAD -- readme.txt` 
- 显示仓库的操作记录：`git log`（可以加上 --pretty=oneline，在一行显示记录）
- 分支合并图: `git log --graph`
- 版本回退：`git reset --hard HEAD^` （例：--hard HEAD^^,HEAD~100等等（同步修改本地文件） 同时修改工作区）
- 清空暂存区的修改：`git reset head readme.txt` （不修改工作区）
- 输出文件内容：`cat readme.txt` 
- 输出每次操作的git id 号：`git reflog` 
- 丢弃工作区的修改：`git checkout -- readme.txt` （让这个文件回到最近一次git commit或git add时的状态）
- 删除文件：`git rm text.txt` 

# GitHub操作 

- 关联GitHub上面的远程库：`git remote add origin https://github.com/moshang-xc/learngit.git` 
- 把本地库的所有内容推送到远程库上：`git push -u origin master` （-u用于第一次）
- 把本地master分支的最新修改推送至GitHub：`git push origin master` 
- 克隆git上面的仓库到本地：`git clone https://github.com/moshang-xc/gitskills.git` 
- 同步GitHub上面的更新到本地：`git pull / git pull origin maste / git fetch`

# Git分支 

- 查看分支：`git branch`
- 创建分支：`git branch <name>`
- 切换分支：`git checkout <name>`
- 创建+切换分支：`git checkout -b <name>`
- 合并某分支到当前分支：`git merge <name>`
- 删除分支：`git branch -d <name>`