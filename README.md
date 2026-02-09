# Requisitos

- Node.js 22 ou superior - Conferir a versão: node -v

## Como rodar o projeto baixado

Instalar todas as dependencias indicadas pelo package.json.

```
npm install
```

Compilar o arquivo TypeScript. Executar o arquivo gerado.

```
npm run dev
```

## Sequencia para criar o projeto

Criar o arquivo package

```
 npm init
```

Instalar o Express para gerenciar as requisições, rotas e URLs, entre outras funcionalidades.

```
npm i express
```

Instalar os pacotes para suporte ao TypeScript.

```
npm i --save-dev @types/express
npm i --save-dev @types/node
```

Instalar o compilador do projeto com TypeScript e reiniciar o projeto quando o arquivo é modificado.

```
npm i --save-dev ts-node
```

Gerar o arquivo de configuração para o TypeScript.

```
npx tsc --init
```

Compilar o arquivo TypeScript.

```
npx tsc
```

Executar o arquivo gerado com o Node.js

```
node dist/index.js
```

Instalar a dependência de forma global, "-g" significa globalmente. Executar o comando através do prompt de comando, executar somente se nunca instalou a dependência na máquina, após instalar, reiniciar o PC.

```
npm install -g nodemon
```

Compilar o arquivo TypeScript com Nodemon. Executar o arquivo gerado.

```
npm run dev
```

## Como enviar e baixar os arquivos do GitHub

Baixar os arquivos do Git

```
git clone --branch <branch_name> <repository_url> .

Or

git clone -b <branch_name> <repository_url> .
```

Verificar em qual branch esta

```
git branch
```

Baixar as atualizações do servidor do GitHub

```
git pull
```

Adicionar todos os arquivos modificados no staging area - área de preparação.

```
git add .
```

commit representa um conjunto de alterações em um ponto específico da história do seu projeto, registra apenas as alterações adicionadas ao índice de preparação.
o comando -m permite que insira a mensagem de commit diretamente na linha de comando.

```
git commit -m "Descrição do commit"
```

Enviar os commits locais para um repositório remoto.

```
git push <remote> <branch>
git push origin <branch>
```
