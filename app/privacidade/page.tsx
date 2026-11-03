import type { Metadata } from "next"
import Link from "next/link"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"
import PaginaLegal from "@/components/layout/PaginaLegal"

export const metadata: Metadata = {
  title: "Política de Privacidade | Eric Lima",
  description:
    "Que dados eu trato em ericlima.com.br e nas reuniões, para quê, com quem compartilho, por quanto tempo guardo e como você exerce seus direitos.",
}

/* Prosa longa. As classes ficam aqui, na página, para não acrescentar regra
   global ao projeto por causa de duas páginas. */
const H = "mt-12 scroll-mt-24 text-xl font-bold leading-snug text-foreground"
const P = "mt-4 leading-relaxed text-muted-foreground"
const UL = "mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground"
const TH = "border border-border bg-secondary px-3 py-2 text-left font-semibold text-foreground"
const TD = "border border-border px-3 py-2 align-top text-muted-foreground"
const A = "text-primary underline underline-offset-4"
const B = "font-semibold text-foreground"

export default function Privacidade() {
  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      atualizacao="2 de novembro de 2026"
      rotulo="privacidade"
    >
      <p className="text-lg leading-relaxed text-muted-foreground">
        Esta política explica o que eu faço com dados pessoais em{" "}
        <span className={B}>ericlima.com.br</span>, nos e-mails que eu envio e nas reuniões que eu
        conduzo. Quem responde por isso sou eu, <span className={B}>Eric Lima</span>, CNPJ
        52.492.085/0001-76, em Brasília, DF.
      </p>

      <h2 className={H} id="papel">1. Em que papel eu estou</h2>
      <p className={P}>
        Na maior parte do que está aqui eu sou <span className={B}>controlador</span>: eu decido o
        que coletar e para quê. É o caso de quem me escreve pelo site, de quem conversa com o
        assistente, de quem recebe um e-mail meu e de quem participa de uma reunião comigo.
      </p>
      <p className={P}>
        Quando eu construo ou mantenho um site para uma empresa, os dados das pessoas que usam{" "}
        <span className={B}>aquele</span> site são da empresa, não meus. Ali eu sou{" "}
        <span className={B}>operador</span>: eu trato esses dados a pedido dela, pelo tempo do
        contrato, e a política que vale é a dela.
      </p>

      <h2 className={H} id="dados">2. Que dados eu trato</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>Quando</th>
              <th className={TH}>O que eu recebo</th>
              <th className={TH}>Por que</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={TD}>Você envia o formulário de contato</td>
              <td className={TD}>Nome, empresa, e-mail, telefone (opcional), a sua mensagem e o endereço de IP do envio</td>
              <td className={TD}>Responder e preparar a proposta. O IP entra para conter envio automatizado</td>
            </tr>
            <tr>
              <td className={TD}>Você conversa com o assistente do site</td>
              <td className={TD}>A sua mensagem, o endereço de IP, a cidade e o país que a hospedagem informa, e o navegador</td>
              <td className={TD}>Gerar a resposta e conter abuso</td>
            </tr>
            <tr>
              <td className={TD}>Você pede para sair da minha lista</td>
              <td className={TD}>O código do link ou o endereço de e-mail que você digitar</td>
              <td className={TD}>Garantir que você não receba de novo</td>
            </tr>
            <tr>
              <td className={TD}>Eu escrevo para a sua empresa</td>
              <td className={TD}>Razão social, CNPJ e o e-mail que a própria empresa declarou no cadastro público da Receita Federal</td>
              <td className={TD}>Oferecer serviço de uma empresa para outra</td>
            </tr>
            <tr>
              <td className={TD}>Nós fazemos uma reunião</td>
              <td className={TD}>O áudio, se você autorizar, e a transcrição dele (ver o item 6)</td>
              <td className={TD}>Entender o que você precisa e preparar a proposta</td>
            </tr>
            <tr>
              <td className={TD}>Você navega no site</td>
              <td className={TD}>Medição de audiência pelo Google Tag Manager, <span className={B}>somente se você aceitar</span></td>
              <td className={TD}>Saber que páginas servem para algo</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={P}>
        Eu não peço dado sensível, não peço documento e não tenho cadastro com senha. Não há conta
        para criar neste site.
      </p>

      <h2 className={H} id="base">3. Com que base legal</h2>
      <ul className={UL}>
        <li>
          <span className={B}>Preparação de contrato</span> (art. 7º, V da LGPD) para o que você me
          manda por formulário ou e-mail pedindo orçamento.
        </li>
        <li>
          <span className={B}>Legítimo interesse</span> (art. 7º, IX) para a segurança do site, os
          limites de uso por IP e a oferta de serviço entre empresas a partir de dado público.
        </li>
        <li>
          <span className={B}>Consentimento</span> (art. 7º, I) para a medição de audiência e para a
          gravação de reunião. Nos dois casos o padrão é não, e o sim é seu.
        </li>
      </ul>

      <h2 className={H} id="ia">4. Inteligência artificial no site</h2>
      <p className={P}>
        O assistente do site responde com um <span className={B}>modelo de linguagem</span>, que é
        um programa que escreve a resposta na hora. Ele pode errar, e o que ele diz não é proposta
        comercial nem aconselhamento profissional. Quem gera a resposta é a{" "}
        <span className={B}>Groq</span>, que recebe a sua mensagem para isso.
      </p>
      <p className={P}>
        <span className={B}>Eu recebo uma cópia da conversa</span>, para ler depois o que as pessoas
        me perguntam. Por isso: não escreva no chat senha, documento, dado de saúde ou qualquer
        coisa que você não escreveria num e-mail. Eu não uso essas conversas para treinar modelo
        nenhum.
      </p>

      <h2 className={H} id="terceiros">5. Com quem eu compartilho</h2>
      <p className={P}>
        Não vendo dado pessoal e não cedo nada para publicidade de terceiros. Os serviços abaixo
        tratam dados por minha conta, só no que é necessário:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>Quem</th>
              <th className={TH}>Para quê</th>
              <th className={TH}>Onde opera</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={TD}>Vercel</td>
              <td className={TD}>Hospedar o site e atender os pedidos</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>Upstash</td>
              <td className={TD}>Guardar o que você envia pelo formulário e os limites de uso</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>Groq</td>
              <td className={TD}>Gerar a resposta do assistente</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>proxycheck.io</td>
              <td className={TD}>Dizer se o IP do pedido é de VPN, proxy ou rede anônima, para conter abuso</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>Resend</td>
              <td className={TD}>Entregar e-mail de aviso e de resposta</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>Telegram e CallMeBot</td>
              <td className={TD}>Me avisar no celular que chegou contato novo</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>Google</td>
              <td className={TD}>Agenda e videochamada da reunião, e a medição de audiência quando você aceita</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
            <tr>
              <td className={TD}>Anthropic</td>
              <td className={TD}>Organizar o texto da transcrição da reunião, quando houver</td>
              <td className={TD}>Fora do Brasil</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={P}>
        Como parte desses serviços opera fora do Brasil, há transferência internacional. Ela se
        apoia nas cláusulas de proteção dos contratos desses provedores, equivalentes ao padrão da
        LGPD (art. 33), e, no caso do conteúdo de reunião gravada, no seu consentimento específico e
        destacado (art. 33, VIII), pedido no início da gravação.
      </p>
      <p className={P}>
        O agendamento pelo Google é diferente, e é justo você saber: eu não tenho com o Google um
        contrato específico de tratamento desses dados. Você escolhe o horário a seu próprio pedido,
        para marcarmos a conversa, e é essa a base da transferência (art. 33, IX, com o art. 7º, V).
        Se preferir não usar o Google, escreva para{" "}
        <a href={CONTACT_MAILTO} className={A}>
          {CONTACT_EMAIL}
        </a>{" "}
        e combinamos por outro caminho. Eu também compartilho dado com{" "}
        <span className={B}>autoridade</span> quando houver obrigação legal ou ordem judicial.
      </p>

      <h2 className={H} id="reunioes">6. Reuniões gravadas</h2>
      <p className={P}>
        Antes de uma proposta eu faço reunião por vídeo com quem tem interesse no serviço: uma para
        entender o negócio e outra que fundamenta o orçamento. Depois de contratado, faço as
        reuniões de implantação com a sua equipe. <span className={B}>Com a sua autorização, dada no
        início da própria reunião, eu gravo o áudio e o transcrevo.</span> Eu não gravo vídeo.
      </p>
      <p className={P}>
        <span className={B}>Para quê:</span> entender o que você precisa, escrever a proposta sem
        depender da minha memória e, na implantação, registrar o que foi combinado sobre textos,
        imagens, prazos e o que o site nunca pode prometer. O que eu aprendo sobre{" "}
        <span className={B}>como conduzir</span> um projeto serve para os próximos; o conteúdo da sua
        reunião não é usado no projeto de outra empresa.
      </p>
      <p className={P}>
        <span className={B}>Base legal:</span> consentimento (art. 7º, I), pedido e respondido já com
        a gravação rodando, para que a sua resposta fique registrada. Quem preferir não ser gravado
        segue a reunião normalmente, sem gravação.
      </p>
      <p className={P}>
        <span className={B}>Quem processa:</span> a videochamada acontece no Google Meet, mas a
        gravação é feita por mim, no meu computador, não pelo Meet.{" "}
        <span className={B}>A transcrição também é feita no meu computador, sem enviar o áudio a
        serviço nenhum.</span> Só o texto, depois de pronto, é organizado com o assistente de IA da
        Anthropic, configurado para não usar o conteúdo em treinamento. Os arquivos ficam no meu
        equipamento, no Brasil.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>O quê</th>
              <th className={TH}>Por quanto tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={TD}>Áudio da reunião</td>
              <td className={TD}>Até a transcrição ser conferida, no máximo 90 dias</td>
            </tr>
            <tr>
              <td className={TD}>Transcrição, quando você me contrata</td>
              <td className={TD}>Enquanto durar o contrato e até 12 meses depois dele</td>
            </tr>
            <tr>
              <td className={TD}>Transcrição, quando não há contratação</td>
              <td className={TD}>Até 12 meses depois da última reunião</td>
            </tr>
            <tr>
              <td className={TD}>O trecho em que a autorização é dada</td>
              <td className={TD}>5 anos depois de a transcrição ser apagada, como prova do consentimento</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={P}>
        Você pode <span className={B}>revogar a autorização a qualquer momento</span> pelo e-mail do
        item 9, sem afetar o que já foi feito com base nela. Revogada, eu apago o áudio e a
        transcrição e guardo apenas o trecho da autorização, pelo prazo da tabela.
      </p>

      <h2 className={H} id="prazos">7. Por quanto tempo eu guardo o resto</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>O quê</th>
              <th className={TH}>Por quanto tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={TD}>O que você envia pelo formulário de contato</td>
              <td className={TD}>365 dias</td>
            </tr>
            <tr>
              <td className={TD}>Cópia da conversa com o assistente</td>
              <td className={TD}>Fica no meu histórico de avisos; eu apago a pedido</td>
            </tr>
            <tr>
              <td className={TD}>Contagem de uso por IP</td>
              <td className={TD}>Entre 1 hora e 24 horas, conforme o limite</td>
            </tr>
            <tr>
              <td className={TD}>Endereço na lista de bloqueio do descadastro</td>
              <td className={TD}>Por prazo indeterminado, porque é exatamente o que impede você de receber de novo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className={H} id="direitos">8. Seus direitos</h2>
      <p className={P}>
        A LGPD te dá direito a confirmação de que eu trato seus dados, acesso, correção,
        anonimização, apagamento, portabilidade, informação sobre com quem eu compartilhei e
        revogação do consentimento. É um e-mail e eu respondo em até 15 dias.
      </p>

      <h2 className={H} id="parar">9. Como parar de receber mensagem</h2>
      <p className={P}>
        Pela página{" "}
        <Link href="/descadastro" className={A}>
          ericlima.com.br/descadastro
        </Link>
        , sem senha, sem confirmação por e-mail e sem precisar dizer o motivo. Todo e-mail meu leva
        esse link.
      </p>

      <h2 className={H} id="seguranca">10. Segurança</h2>
      <p className={P}>
        O site serve tudo por conexão cifrada, as chaves de acesso aos serviços ficam fora do código
        e os limites por IP existem para que ninguém use o formulário e o assistente como
        ferramenta. Nenhuma medida elimina risco: se algum dia houver incidente que possa te
        prejudicar, eu te aviso e comunico a ANPD.
      </p>

      <h2 className={H} id="cookies">11. Cookies e medição</h2>
      <p className={P}>
        O site carrega o Google Tag Manager com a medição{" "}
        <span className={B}>desligada por padrão</span>. Nada de audiência é registrado antes de você
        aceitar no aviso que aparece na primeira visita. A sua escolha fica guardada no seu próprio
        navegador, e some se você limpar os dados do site. O que é necessário para o site funcionar e
        para a segurança continua ativo, porque sem isso não há site.
      </p>

      <h2 className={H} id="alteracoes">12. Alterações</h2>
      <p className={P}>
        Quando eu mudar esta política, a data no topo muda. Se a mudança afetar o que eu faço com
        dado que já é seu, eu aviso por e-mail quem tiver contato comigo.
      </p>

      <h2 className={H} id="encarregado">13. Encarregado</h2>
      <p className={P}>
        Eu mesmo, como profissional individual, por{" "}
        <a href={CONTACT_MAILTO} className={A}>
          {CONTACT_EMAIL}
        </a>
        . Veja também os{" "}
        <Link href="/termos" className={A}>
          Termos de Uso
        </Link>
        .
      </p>
    </PaginaLegal>
  )
}
