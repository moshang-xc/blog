const fs = require("fs");
const path = require("path");

const { exec } = require("child_process");
//scss文件的相对路径
const dirPath = "./shengyuan-frontend/lib/";
// lib下全局scss文件列表，不单独进行sass编译处理，同时修改公共文件触发整体重新编译
const commonFileList = ["variables.scss", "common.scss"];

let fileList = [];

function findDirPath() {
  let filepath = path.join(dirPath);
  fileList = fs.readdirSync(filepath);
  console.log("fileList", fileList);

  commandDir();
}

findDirPath();

fs.watch(dirPath, (event, filename) => {
  let extname = path.extname(filename);
  if (extname === ".scss") {
    if (commonFileList.indexOf(filename) > -1) {
      commandDir();
    } else {
      compareScss(filename);
    }
  }
});

//公共文件
// fs.watch(path.join(dirPath, "scss"), (event, filename) => {
//   let extname = path.extname(filename);
//   if (extname === ".scss") {
//     commandDir();
//   }
// });

function compareScss(filename) {
  // 如果是公共文件，则不做处理
  if (commonFileList.indexOf(filename) > -1) {
    return;
  }
  //文件路径
  let filePath = path.join(dirPath, filename);
  //执行命令
  let command = `sass ${filePath} ${filePath}.css --no-source-map`;
  console.log("[log]", command);
  exec(command);
}

function commandDir() {
  fileList.forEach(item => {
    if (item.slice(-5) === ".scss") {
      compareScss(item);
    }
  });
}
