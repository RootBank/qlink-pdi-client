#!/bin/bash

# Fail on error
set -e

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Ensure SSH access only for ec2-user
sudo passwd -l ec2-user

# Variables
REPO_URL="https://github.com/RootBank/qlink-xml-client.git"
PROJECT_DIR="/home/ec2-user/qlink-xml-client"
NVM_DIR="/home/ec2-user/.nvm"

# Step 1: Update system packages
echo "Updating system packages..."
sudo yum update -y
sudo yum install -y git

# Step 2: Install NVM (Node Version Manager) for ec2-user
if ! sudo -u ec2-user bash -c "command -v nvm &> /dev/null"; then
    echo "Installing NVM for ec2-user..."
    sudo -u ec2-user bash -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash"

    # Ensure NVM is loaded in ec2-user's profile for future sessions
    echo 'export NVM_DIR="$HOME/.nvm"' >> /home/ec2-user/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/ec2-user/.bashrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> /home/ec2-user/.bashrc
else
    echo "NVM is already installed for ec2-user."
fi

# Step 3: Clone the project from GitHub as ec2-user
echo "Cloning the repository..."
if [ ! -d "$PROJECT_DIR" ]; then
  sudo -u ec2-user git clone $REPO_URL $PROJECT_DIR
else
  echo "Repository already exists in $PROJECT_DIR"
fi

# Step 4: Change directory to the project folder
cd $PROJECT_DIR

# Step 5: Use NVM to install the Node.js version specified in .nvmrc
if [ -f ".nvmrc" ]; then
    NODE_VERSION=$(cat .nvmrc)
    echo "Installing Node.js version specified in .nvmrc: $NODE_VERSION"
    sudo -u ec2-user bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION"
else
    echo ".nvmrc file not found. Please create it in the project root to specify the Node.js version."
    exit 1
fi

# Step 6: Install TypeScript globally using NVM-installed Node.js for ec2-user
echo "Installing TypeScript globally..."
sudo -u ec2-user bash -c "source $NVM_DIR/nvm.sh && npm install -g typescript"

# Step 7: Install project dependencies using NVM-installed Node.js
echo "Installing project dependencies..."
sudo -u ec2-user bash -c "source $NVM_DIR/nvm.sh && cd $PROJECT_DIR && npm install"

# Final message
echo "Remote development environment setup complete!"
echo "You can now SSH into the server and work from the remote environment."