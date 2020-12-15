# Git分支操作
- git branch 查看分支
- git branch <name> 创建分支
- git checkout <name> 切换分支
- git checkout -b <name> 创建并切换到新建的分支上
- git branch -v 查看所有分支的最后一次操作
- git branch -vv 查看当前分支
- git brabch -b <name> origin/<name> 创建远程分支到本地
- git branch --merged 查看别的分支和当前分支合并过的分支
- git branch --no-merged 查看未与当前分支合并的分支
- git branch -d <name> 删除本地分支
- git branch -D <name> 强行删除分支
- git branch origin :<name> 删除远处仓库分支
- git merge <name> 合并分支到当前分支上

# 暂存操作
- git stash 暂存当前修改
- git stash apply 恢复最近的一次暂存
- git stash pop 恢复暂存并删除暂存记录
- git stash list 查看暂存列表
- git stash drop 暂存名(例：stash@{0}) 移除某次暂存
- git stash clear 清除暂存

# 回退操作
- git reset --hard HEAD^ 回退到上一个版本
- git reset --hard ahdhs1(commit_id) 回退到某个版本
- git checkout -- file撤销修改的文件(如果文件加入到了暂存区，则回退到暂存区的，如果文件加入到了版本库，则还原至加入版本库之后的状态)
- git reset HEAD file 撤回暂存区的文件修改到工作区

# 标签操作
- git tag 标签名 添加标签(默认对当前版本)
- git tag 标签名 commit_id 对某一提交记录打标签
- git tag -a 标签名 -m '描述' 创建新标签并增加备注
- git tag 列出所有标签列表
- git show 标签名 查看标签信息
- git tag -d 标签名 删除本地标签
- git push origin 标签名 推送标签到远程仓库
- git push origin --tags 推送所有标签到远程仓库
- git push origin :refs/tags/标签名 从远程仓库中删除标签

# 常规操作
- git push origin test 推送本地分支到远程仓库
- git rm -r --cached 文件/文件夹名字 取消文件被版本控制
- git reflog 获取执行过的命令
- git log --graph 查看分支合并图
- git merge --no-ff -m '合并描述' 分支名 不使用Fast forward方式合并，采用这种方式合并可以看到合并记录
- git check-ignore -v 文件名 查看忽略规则
- git add -f 文件名 强制将文件提交

# git创建项目仓库
- git init 初始化
- git remote add origin url 关联远程仓库
- git pull
- git fetch 获取远程仓库中所有的分支到本地

# 忽略已加入到版本库中的文件
- git update-index --assume-unchanged file 忽略单个文件
- git rm -r --cached 文件/文件夹名字 (. 忽略全部文件)

# 取消忽略文件
- git update-index --no-assume-unchanged file

# 拉取、上传免密码
- git config --global credential.helper store

# GitHub操作 
- 关联GitHub上面的远程库：`git remote add origin https://github.com/moshang-xc/learngit.git` 
- 把本地库的所有内容推送到远程库上：`git push -u origin master` （-u用于第一次）
- 把本地master分支的最新修改推送至GitHub：`git push origin master` 
- 克隆git上面的仓库到本地：`git clone https://github.com/moshang-xc/gitskills.git` 
- 同步GitHub上面的更新到本地：`git pull / git pull origin maste / git fetch`

# 操作命令 
- 显示当前目录路径：`pwd` 
- 切换到d盘：`cd d` 
- 后退到上一级目录：`cd ..` 
- 显示当前路径下面的文件：`ls` 
- 显示当前路径下面的文件包括隐藏文件：`ls -as`
- 把文件添加到git仓库暂存区：`git add xx.xx` 
- 比较版本差别：`git diff HEAD -- readme.txt` 
- 输出文件内容：`cat readme.txt` 


# 修改注释

## 修改最后一次注释（最新的一次提交的注释）
```
git commit --amend
```
出现有注释的界面（你的注释应该显示在第一行）， 输入`i`进入修改模式，修改好注释后，按`Esc`键 退出编辑模式，输入`:wq`保存并退出。
运行`git log --oneline`查看log是否修改成功

