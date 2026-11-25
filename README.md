# 🦥 Slowi — Seu espaço, seu tempo

**Um espaço digital de acolhimento, autoconhecimento e conscientização sobre saúde mental.**

O Slowi é um projeto acadêmico individual desenvolvido na São Paulo Tech School, idealizado a partir da minha própria vivência e da vontade de tornar o cuidado com a saúde mental um assunto mais presente, acessível e próximo da realidade das pessoas.

Inspirado na ideia de desacelerar e respeitar o próprio ritmo, o projeto busca oferecer um ambiente digital acolhedor para quem deseja compreender melhor suas emoções, refletir sobre seus sentimentos e encontrar um primeiro apoio na jornada de autocuidado.

Mais do que uma aplicação web, o Slowi representa a ideia de que cuidar de si não precisa ser rápido, perfeito ou acontecer de uma só vez.

> 🌿 **Seu espaço, seu tempo.** Cada pessoa tem seu próprio ritmo, e até os passos mais curtos fazem parte do caminho.

---

## 🎯 Objetivo do projeto

O objetivo do Slowi é desenvolver um espaço web pessoal de apoio e conscientização sobre saúde mental, reunindo ferramentas de reflexão e recursos informativos que incentivem o autoconhecimento e o cuidado emocional.

A plataforma foi pensada principalmente para pessoas que estão começando a buscar informações sobre saúde mental e ainda não sabem por onde começar.

Por meio de uma linguagem simples, uma interface intuitiva e recursos acessíveis, o Slowi procura tornar esse primeiro contato mais leve e acolhedor.

O projeto não oferece diagnósticos ou tratamentos e não substitui o acompanhamento de psicólogos, psiquiatras ou outros profissionais qualificados.

## ✨ Funcionalidades

### ✅ Funcionalidades implementadas

- **Página inicial:** apresentação do Slowi, de sua proposta e da identidade visual do projeto.
- **Cadastro e login:** criação de contas e autenticação de usuários, com proteção de senhas por hash e salt.
- **Diário emocional:** registro de emoções, intensidade, reflexões pessoais e etiquetas relacionadas ao cotidiano.
- **Histórico emocional:** consulta aos registros realizados, com opções para editar e excluir informações.
- **Dashboard pessoal:** visualização de indicadores e gráficos que ajudam a acompanhar os próprios registros.
- **Gráfico de emoções:** identificação das emoções mais frequentes no período analisado.
- **Gráfico de registros:** visualização da quantidade de registros realizados ao longo dos dias.
- **Indicadores emocionais:** acompanhamento da quantidade de registros e da intensidade média das emoções nos últimos 14 dias.
- **Onde buscar ajuda:** apresentação de contatos e serviços oficiais de apoio, incluindo CVV, SAMU e CAPS.
- **Sobre mim:** espaço para compartilhar a motivação por trás do projeto e a experiência de desenvolvimento.

### 🚧 Planos futuros

- **Biblioteca de conteúdos:** textos educativos sobre saúde mental, autoconhecimento, estigma, normalização do sofrimento e autocuidado, com possibilidade de favoritar conteúdos.
- **Respiração guiada:** atividade de respiração com opção de música suave ao fundo.
- **Técnica de grounding:** exercício de atenção aos sentidos para ajudar a pessoa a se reconectar com o momento presente.
- **Descarregamento de pensamentos:** espaço livre para escrever pensamentos e sentimentos sem a necessidade de organizá-los.
- **Organizador de preocupações:** ferramenta de reflexão com perguntas que ajudam a diferenciar o que está ou não sob o próprio controle.
- **Sessão mais segura:** implementação de um sistema de sessões gerenciadas pelo servidor, utilizando tokens de autenticação para proteger o acesso aos registros pessoais.

*As funcionalidades futuras serão desenvolvidas gradualmente, conforme a evolução do projeto.*

## 🎨 Identidade visual

A identidade visual do Slowi foi construída para transmitir tranquilidade, acolhimento e simplicidade.

- **Paleta de cores:** predominância de tons de lilás e cores suaves, escolhidos para criar uma experiência visual confortável.
- **Mascote:** um bicho-preguiça cartunesco chamado Slowi, que simboliza perseverança, calma e respeito ao próprio ritmo.
- **Linguagem:** comunicação simples, próxima e acolhedora, com textos em primeira pessoa.
- **Experiência:** interfaces intuitivas, navegação simples e organização visual que evita o excesso de informações.

O conceito central da identidade é lembrar que desacelerar não significa deixar de avançar.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estruturação das páginas |
| CSS3 | Estilização, identidade visual e responsividade |
| JavaScript | Interatividade e funcionalidades da aplicação |
| Node.js | Ambiente de execução do back-end |
| Express | Criação de rotas e gerenciamento das requisições |
| MySQL | Armazenamento e gerenciamento dos dados |
| Chart.js | Construção dos gráficos do dashboard |
| web-data-viz | API utilizada na visualização dos gráficos |

## 🗄️ Banco de dados

O Slowi utiliza MySQL para armazenar e organizar as informações da aplicação.

A estrutura contempla tabelas relacionadas a:

- **Cadastro:** informações das contas dos usuários.
- **Emoção:** emoções disponíveis e suas respectivas cores.
- **Diário emocional:** registros pessoais, datas, intensidade e emoções associadas.
- **Etiqueta:** categorias utilizadas para organizar os registros.
- **RegistroEtiqueta:** relacionamento entre registros emocionais e etiquetas.

O diário permite realizar as quatro operações fundamentais de um CRUD:

- **Create:** criar novos registros emocionais.
- **Read:** consultar registros e visualizar o histórico.
- **Update:** editar registros existentes.
- **Delete:** excluir registros.

Os relacionamentos entre as tabelas permitem manter os dados organizados e reduzir a duplicação de informações.

## 🔒 Privacidade e responsabilidade

O Slowi trabalha com informações potencialmente pessoais e registros emocionais. Por isso, a privacidade e a segurança são aspectos importantes do projeto.

Entre as medidas implementadas estão:

- Armazenamento de senhas com hash e salt.
- Validação dos dados recebidos pelo servidor.
- Organização dos registros de acordo com a conta do usuário.
- Utilização de relacionamentos e chaves estrangeiras no banco de dados.

Apesar dessas medidas, a versão atual ainda possui limitações de segurança. A identificação do usuário nas requisições utiliza o identificador da conta enviado pelo navegador. Uma evolução prevista é implementar sessões gerenciadas pelo servidor, reforçando a proteção dos registros pessoais.

O Slowi é um projeto acadêmico e exploratório. Não oferece diagnóstico, tratamento ou atendimento emergencial e não substitui o acompanhamento de profissionais de saúde.

Em situações de crise ou risco, procure ajuda diretamente pelos serviços oficiais:

- **CVV:** 188 — apoio emocional.
- **SAMU:** 192 — atendimento de urgência e emergência.
- **CAPS:** Centros de Atenção Psicossocial do SUS.

## 🚀 Como executar

O projeto está disponível para acesso pela versão publicada:

[**Acessar o Slowi**](https://vitor-oarevalo.github.io/slowi/public/pages/landing-page.html)

Para que o projeto funcione, será necessário executar localmente, será preciso configurar o ambiente com Node.js e MySQL, preparar o banco de dados e iniciar o servidor da aplicação.

## 👤 Desenvolvimento

O Slowi é um projeto acadêmico individual, desenvolvido por **Vitor Arevalo** na São Paulo Tech School, em 2026.

Sua construção envolve conhecimentos de desenvolvimento front-end, back-end, banco de dados, organização de informações e experiência do usuário.

O projeto também representa uma oportunidade de explorar como a tecnologia pode ser utilizada para abordar questões humanas e contribuir, mesmo que em pequena escala, para uma sociedade mais consciente sobre saúde mental.

## 💜 Uma mensagem do Slowi

*Você não precisa resolver tudo hoje.*

*Às vezes, o primeiro passo é parar um instante, respirar e tentar entender como você está se sentindo.*

**Slowi — Seu espaço, seu tempo.** 🦥💜

---
