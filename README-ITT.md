# Deploy Container App:
az containerapp up \
    --name aitest2 \
    --resource-group tst-az-rg-aitest2 \
    --source . \
    --registry-server msncsr1.azurecr.io \
    --ingress external \
    --target-port 3000

az containerapp ingress enable -n aitest2 -g tst-az-rg-aitest2 --type external --target-port 3000 --transport auto

# Stream logs:
az containerapp logs show -n aitest2 -g tst-az-rg-aitest2