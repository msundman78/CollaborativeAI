# Set Vars
ACA_APP_NAME="aitest2"
ACA_RG="tst-az-rg-aitest2"

# Deploy Container App:
az containerapp up \
    --name $ACA_APP_NAME \
    --resource-group tst-az-rg-aitest2 \
    --source . \
    --registry-server msncsr1.azurecr.io \
    --ingress external \
    --target-port 3000

az containerapp ingress enable -n $ACA_APP_NAME -g $ACA_RG --type external --target-port 3000 --transport auto

# Stream logs:
az containerapp logs show --follow -n $ACA_APP_NAME -g $ACA_RG

# Use the following script to update ACA environment vars based on .env file:
./azure_update_env_aca.sh

# Or, set Envs manually with:
az containerapp update \
  --name $ACA_APP_NAME \
  --resource-group $ACA_RG \
  --set-env-vars "FOO_BAR_1=test" "FOO_BAR_2=test2"

# Configure CORS:
az containerapp ingress cors enable \
  -n $ACA_APP_NAME -g $ACA_RG \
  --allowed-origins http://localhost:3000 https://ittaiweb1.z1.web.core.windows.net/ \
  --allowed-methods GET POST