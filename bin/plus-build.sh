#!/bin/bash

#plus发布系统build脚本

# 启用所有命令的检查
set -e

init_var() {
  WORKSPACE=`pwd`
  DEPLOY_PATH=$WORKSPACE/deploy/
}

print_env() {
  echo "内核信息"
  uname -a

  echo "现存 node 版本 ==========================================="
  echo node version: $(node --version)
  echo npm version: $(npm --version)
}

elapsed_time() {
  # mac下不支持%3N
  local START_TIME=`echo $(($(date +%s%3N)))`
  echo "---------------$2开始-----------------------"
  $1
  if [ $? -ne 0 ]; then
    echo "$1 执行失败!!!"
    exit 1
  fi
  local END_TIME=`echo $(($(date +%s%3N)))`
  local ELAPSED_TIME=$(($END_TIME - $START_TIME))
  echo "-------$2结束，耗时： $ELAPSED_TIME ms-------"
}

install_npm() {
  local current_npm=$(npm -v)
  if [[ -n $NPM_VERSION && $current_npm != $NPM_VERSION ]]; then
   npm i --registry=http://r.npm.sankuai.com -g npm@$NPM_VERSION
  fi
}

clean_cache() {
  local NEED_CLEAN_CACHE=true
  # start pm2
  if [ "$CLEAN_CACHE" = "$NEED_CLEAN_CACHE" ]
  then
    rm -rf node_modules
    yarn cache clean
  fi
}

install_package() {
  npm i --registry=http://r.npm.sankuai.com
}

install_yarn() {
  npm --registry=http://r.npm.sankuai.com i -g yarn
  yarn install --ignore-scripts --registry=http://r.npm.sankuai.com
  export NODE_TLS_REJECT_UNAUTHORIZED=0
  # echo "开始安装一些比较特殊的依赖"
  # yarn run postinstall
  # echo "特殊依赖安装完成"
}

webpack_deploy() {
  npm run build
}

public_rsync() {
  set -xe
  echo "sync public files to bona"
  cd ./public
  tar -czf update.tar.gz *
  curl -F "files=@update.tar.gz" -F "appKey=force" -F "secretKey=A5A233DBE63A08B943AB806A62017963" -F "dangerousCover=1" http://rock.movie.vip.sankuai.com/api/bona/upload && rm update.tar.gz
}

# 下载并安装 Ollama
install_ollama() {
  echo "正在下载并安装 Ollama..."
  curl -L https://ollama.ai/download/ollama-linux-amd64 -o /tmp/ollama
  chmod +x /tmp/ollama
  sudo mv /tmp/ollama /usr/local/bin/ollama
  echo "Ollama 安装完成。"
}

# 下载 Deepseek 大模型
download_deepseek_model() {
  echo "正在下载 Deepseek 大模型..."
  ollama pull deepseek
  echo "Deepseek 大模型下载完成。"
}

# 主逻辑
echo "plus-build.sh 脚本开始执行..."

# 安装 Ollama
if ! command -v ollama &> /dev/null; then
  install_ollama
else
  echo "Ollama 已安装，跳过安装步骤。"
fi

# 下载 Deepseek 大模型
download_deepseek_model

init_var
print_env
# do not need to clean cache
# clean_cache
elapsed_time install_yarn    "安装npm package"
elapsed_time webpack_deploy  "编译静态文件"
elapsed_time public_rsync    "静态资源上传"

echo "plus-build.sh 脚本执行完成。"
