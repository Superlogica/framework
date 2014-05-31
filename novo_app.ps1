$appName = Read-Host "digite o nome do aplicativo(Sem espaço ou caracteres especiais):"
robocopy "$pwd/sdk/skeleton/"* "$pwd/sdk/$appName" /e