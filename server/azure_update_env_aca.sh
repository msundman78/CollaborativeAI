#!/bin/bash

# Set your Container App name and resource group name
APP_SERVICE_NAME="aitest2"
RESOURCE_GROUP="tst-az-rg-aitest2"

# Path to your .env file
ENV_FILE=".env"

# Initialize an array to hold environment variables
declare -a ENV_VARS

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE does not exist."
    exit 1
fi

# Read each line in .env file and add to the array
while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip empty lines and comments
    if [ -z "$line" ] || [[ $line = \#* ]]; then
        continue
    fi

    # Add the line to the array
    ENV_VARS+=("$line")
done < "$ENV_FILE"

echo "Setting environment variables:"
for var in "${ENV_VARS[@]}"; do
    echo "$var"
done

# Use the Azure CLI to set the environment variables for the container app
az containerapp update \
    --name "$APP_SERVICE_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --set-env-vars "${ENV_VARS[@]}"

echo "All settings have been updated."
