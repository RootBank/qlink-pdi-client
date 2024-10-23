#!/bin/bash

# Fail on error
set -e

# Ensure script is run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Ensure SSH access only
sudo passwd -l ec2-user

# Variables
REPO_URL="https://github.com/RootBank/qlink-xml-client.git"
PROJECT_DIR="/home/ec2-user/qlink-xml-client"

# Step 1: Update system packages
echo "Updating system packages..."
sudo yum update -y
sudo yum install -y git

# Step 2: Install NVM (Node Version Manager) if not installed
if ! command -v nvm &> /dev/null
then
    echo "Installing NVM (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    echo "NVM is already installed."
fi

# Step 3: Clone the project from GitHub
echo "Cloning the repository..."
if [ ! -d "$PROJECT_DIR" ]; then
  git clone $REPO_URL $PROJECT_DIR
else
  echo "Repository already exists in $PROJECT_DIR"
fi

# Step 4: Change directory to the project folder
cd $PROJECT_DIR

# Step 5: Check if .nvmrc exists and install the specified Node.js version
if [ -f ".nvmrc" ]; then
    NODE_VERSION=$(cat .nvmrc)
    echo "Installing Node.js version specified in .nvmrc: $NODE_VERSION"
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
else
    echo ".nvmrc file not found. Please create it in the project root to specify the Node.js version."
    exit 1
fi

# Step 6: Install TypeScript globally
echo "Installing TypeScript globally..."
npm install -g typescript

# Step 7: Install project dependencies
echo "Installing project dependencies..."
npm install

# Step 8: Optional - Setup SSH key pair (if needed)
# Prefer key forwarding in your ssh config.

# echo "Setting up SSH keys (if necessary)..."
# SSH_DIR="/home/ec2-user/.ssh"
# if [ ! -f "$SSH_DIR/id_rsa" ]; then
#   ssh-keygen -t rsa -b 2048 -f $SSH_DIR/id_rsa -N "" -C "remote-dev"
#   echo "SSH key generated."
#   echo "Public key to add to GitHub:"
#   cat $SSH_DIR/id_rsa.pub
# else
#   echo "SSH key already exists."
# fi

# Step 9: Final message
echo "Remote development environment setup complete!"
echo "You can now SSH into the server and work from the remote environment."