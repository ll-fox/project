#!/bin/bash

# plus发布系统check脚本

# 启用所有命令的检查
set -e

# 检查 Ollama 是否正常运行
check_ollama() {
  echo "正在检查 Ollama 是否正常运行..."
  if curl -s http://localhost:11434 > /dev/null; then
    echo "Ollama 正常运行。"
  else
    echo "Ollama 未正常运行。"
    exit 1
  fi
}

# 主逻辑
echo "plus-check.sh 脚本开始执行..."

check_ollama

echo "plus-check.sh 脚本执行完成。"
