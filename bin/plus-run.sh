#!/bin/bash

#plus发布系统deploy脚本

# Enables checking of all commands

init() {

  set -e
  mkdir -p /opt/logs/ipro
}

. ~/.bashrc

has_node() {
  if command -v node >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

has_nvm() {
  if command -v nvm >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

print_env() {
  echo "内核信息"
  uname -a

  if has_node; then
    echo "当前node版本是 `node -v`";
  fi
}


upgrade_node() {
  echo 'upgrade_node'
  # 判断 node 是否存在
  local CURRENT_NODE_VERSION;
  if has_node; then
    CURRENT_NODE_VERSION=$(node -v)
  fi

  # 先判断 nvm 是否存在，不存在，则安装之
  # if ! has_nvm; then
  #   curl -Ls -o- http://build.sankuai.com/nvm/install | bash
  #   source ~/.bashrc
  # fi

  # 最新的lts版本
  local NEED_NODE_VERSION="v18.18.0"
  if [[ $CURRENT_NODE_VERSION != $NEED_NODE_VERSION ]]; then
    export NVM_NODEJS_ORG_MIRROR=http://npm.sankuai.com/mirrors/node
    nvm install $NEED_NODE_VERSION
    nvm use $NEED_NODE_VERSION
    nvm alias default $NEED_NODE_VERSION
  fi
}

restart_pm() {
  echo "restart_pm"
  ./node_modules/.bin/pm2 kill
  ./node_modules/.bin/pm2 start process.json --no-daemon
}

# 启动 Ollama
start_ollama() {
  echo "正在启动 Ollama..."
  ollama serve &
  echo "Ollama 已启动。"
}

echo "plus-run-tx文件开始执行 init";

init
print_env
upgrade_node
print_env
restart_pm
start_ollama

echo "plus-run.sh 脚本执行完成。"