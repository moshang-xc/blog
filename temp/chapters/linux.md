- cd: 切换目录
- pwd: 显示当前目录
- mkdir: 新建一个新的目录
- rmdir: 删除一个空的目录
- cd -: 回到上一个目录
- ls: 查看文件与目录
- cp: 文件复制

```
-r: 递归持续复制
-f: 强制复制，若目标文件已存在且无法开启，则删除后再尝试一次

cp /val/log/wtmp .  //将wtmp下的文件复制到当前目录
cp -a /val/log/wtmp .  //将wtmp下的文件复制到当前目录，连同文件的特性一起复制
```

- rm: 移除文件或目录

```
-f: 强制，忽略不存在的文件，不会出现警告信息
-i: 互动模式
-r: 递归删除
rm -r ./dist //递归删除dist文件夹及里面的内容
rm -f dist.rar //删除dist.rar
```

- mv: 移动文件或更名

```
mv bash mvtest // 将文件bash移动到mvtest
mv mvtest mvtest2 //将mvtest重命名为mvtest2
```

## 使用

```
tftp -gr dist.tar 192.xx.x.x

# 解压
tar -xvf dist.tar

cp dist/* /webroot -rf
```

