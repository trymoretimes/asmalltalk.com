#!/bin/bash

set -e

function ask_password {
  sudo true
}

function install_kernel_extra {
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
  sudo sh -c "echo deb https://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list"
  sudo apt-get update
  sudo apt-get install lxc-docker -y
}

function install_docker {
  wget -qO- https://get.docker.com/ | sh
}

function install_docker_compose {
  COMPOSE_VERSION=`git ls-remote https://github.com/docker/compose | grep refs/tags | grep -oP "[0-9]+\.[0-9]+\.[0-9]+$" | tail -n 1`
  sudo sh -c "curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose"
  sudo chmod +x /usr/local/bin/docker-compose
  sudo sh -c "curl -L https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose"
}

ask_password
install_kernel_extra
install_docker
install_docker_compose
