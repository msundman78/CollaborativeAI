#!/bin/bash

# Set your App Service name and resource group name
APP_SERVICE_NAME="itt-aichat"
RESOURCE_GROUP="tst-az-rg-aiweb"

# Path to your .env file
ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE does not exist."
    exit 1
fi

# Read each line in .env file
while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip empty lines and comments
    if [ -z "$line" ] || [[ $line = \#* ]]; then
        continue
    fi

    # Use the Azure CLI to set the app setting
    # Splitting line into name and value by '='
    IFS='=' read -ra KV <<< "$line"
    KEY="${KV[0]}"
    VALUE="${KV[1]}"

    # Replace this echo with the command to set the configuration in Azure
    # Ensure you have logged in with az login before running this
    az webapp config appsettings set --name "$APP_SERVICE_NAME" \
                                     --resource-group "$RESOURCE_GROUP" \
                                     --settings "$KEY=$VALUE"
done < "$ENV_FILE"

echo "All settings have been updated."
