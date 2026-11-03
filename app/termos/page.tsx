import type { Metadata } from "next"
import Link from "next/link"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"
import PaginaLegal from "@/components/layout/PaginaLegal"

export const metadata: Metadata = {
  title: "Termos de Uso | Eric Lima",
  description:
    "Condições de uso de ericlima.com.br: o que o site é, o que o assistente de IA faz e não faz, e como se dá a contratação de serviço.",
}

const H = "mt-12 scroll-mt-24 text-xl font-bold leading-snug text-foreground"
const P = "mt-4 leading-relaxed text-muted-foreground"
const UL = "mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground"
const A = "text-primary underline underline-offset-4"
const B = "font-semibold text-foreground"

export default function Termos() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizacao="2 de novembro de 2026" rotulo="termos">
      <p className="text-lg leading-relaxed text-muted-foreground">
        Estes termos regem o uso do site <span className={B}>ericlima.com.br</span>, operado por{" "}
        <span className={B}>Eric Lima</span>, CNPJ 52.492.085/0001-76, em Brasília, DF. Usar o site é
        concordar com eles.
      </p>

      <h2 className={H} id="o-que-e">1. O que este site é</h2>
      <p className={P}>
        É o meu portfólio e o meu canal de contato. Aqui eu mostro trabalho que fiz, descrevo o que
        eu faço e recebo pedido de orçamento. <span className={B}>Não é uma plataforma:</span> não
        tem conta, não tem senha, não tem painel e nada se compra por autoatendimento.
      </p>

      <h2 className={H} id="quem">2. A quem se aplicam</h2>
      <ul className={UL}>
        <li>
          <span className={B}>Visitante</span>, quem abre qualquer página.
        </li>
        <li>
          <span className={B}>Interessado</span>, quem me escreve pelo formulário, pelo assistente ou
          por e-mail.
        </li>
        <li>
          <span className={B}>Cliente</span>, quem contrata um serviço. A relação de cliente é regida
          pela proposta assinada, não por esta página.
        </li>
      </ul>

      <h2 className={H} id="contratacao">3. O site não contrata nada</h2>
      <p className={P}>
        Preço, prazo, escopo e forma de pagamento valem quando estão numa{" "}
        <span className={B}>proposta escrita</span> que você aprova. Valor citado em página, em
        conversa com o assistente ou em e-mail de apresentação é estimativa de partida, serve para
        você saber a ordem de grandeza e não vincula nenhuma das partes.
      </p>

      <h2 className={H} id="assistente">4. O assistente de IA: o que ele não é</h2>
      <p className={P}>
        O chat do site responde com um <span className={B}>modelo de linguagem</span>, um programa
        que escreve a resposta na hora a partir do que eu configurei.{" "}
        <span className={B}>Ele pode errar</span>, inclusive sobre preço e prazo. O que ele diz não é
        proposta comercial, não é parecer técnico e não é aconselhamento de nenhuma natureza.
      </p>
      <p className={P}>
        Eu recebo cópia das conversas, então não escreva ali senha, documento, dado de saúde ou
        qualquer coisa que você não escreveria num e-mail. Há limite de uso por endereço de IP, para
        que o assistente continue disponível para quem quer falar comigo.
      </p>

      <h2 className={H} id="vedado">5. Uso vedado</h2>
      <ul className={UL}>
        <li>Enviar pelo formulário ou pelo chat conteúdo ilícito, enganoso, ofensivo ou de terceiro sem autorização.</li>
        <li>Tentar burlar os limites técnicos, varrer o site de forma automatizada ou explorar falha em vez de me avisar dela.</li>
        <li>Usar o assistente para extrair dados, gerar conteúdo ilícito ou se passar por mim ou por cliente meu.</li>
        <li>Copiar o código, o texto ou o material visual do site para republicar como seu.</li>
      </ul>
      <p className={P}>
        Quem faz isso perde o acesso, e eu guardo o registro técnico necessário para me defender.
      </p>

      <h2 className={H} id="disponibilidade">6. Disponibilidade</h2>
      <p className={P}>
        Eu trabalho para manter o site de pé, mas ele depende de terceiros: hospedagem, banco de
        dados, provedor de IA e provedor de e-mail. Não garanto operação ininterrupta e posso fazer
        manutenção. Os terceiros estão nomeados um por um na{" "}
        <Link href="/privacidade" className={A}>
          Política de Privacidade
        </Link>
        .
      </p>

      <h2 className={H} id="propriedade">7. Propriedade</h2>
      <p className={P}>
        O código, os textos e o material visual deste site são meus. As marcas, os nomes e as imagens
        de empresas citadas no portfólio pertencem a elas e aparecem aqui como referência de trabalho
        feito, não como endosso delas a nada.
      </p>
      <p className={P}>
        O que você me manda continua seu. Eu uso o material que você envia apenas para atender o seu
        pedido, e só publico trabalho feito para você no portfólio{" "}
        <span className={B}>com a sua autorização</span>.
      </p>

      <h2 className={H} id="responsabilidade">8. Responsabilidade</h2>
      <p className={P}>
        O conteúdo do portfólio é descritivo. Número citado sobre um projeto se refere ao que foi
        medido naquele projeto e <span className={B}>não é promessa de resultado</span> para o
        próximo: resultado depende de mercado, de oferta e de operação, que não são minhas.
      </p>
      <p className={P}>
        Pelo uso deste site, a minha responsabilidade se limita ao dano direto comprovado. Para
        serviço contratado, o limite é o que estiver na proposta assinada.
      </p>

      <h2 className={H} id="email">9. E-mail de prospecção</h2>
      <p className={P}>
        Eu escrevo para empresas a partir do <span className={B}>cadastro público de CNPJ da Receita
        Federal</span>, onde o e-mail que a própria empresa declarou é aberto a qualquer pessoa. É
        oferta de serviço de uma empresa para outra, enviada uma vez, com no máximo um segundo
        contato depois. Não compro lista e não pego endereço de rede social. Para sair, a página é{" "}
        <Link href="/descadastro" className={A}>
          ericlima.com.br/descadastro
        </Link>
        , e quem sai não volta a receber.
      </p>

      <h2 className={H} id="reunioes">10. Reuniões</h2>
      <p className={P}>
        As reuniões acontecem por videochamada. <span className={B}>Com a sua autorização, dada no
        início da reunião, eu gravo o áudio</span> e o transcrevo, para escrever a proposta sem
        depender da minha memória. Eu não gravo vídeo, e quem preferir não ser gravado segue a
        reunião normalmente. O detalhe de prazo, de base legal e de como revogar está no item 6 da{" "}
        <Link href="/privacidade" className={A}>
          Política de Privacidade
        </Link>
        .
      </p>

      <h2 className={H} id="alteracoes">11. Alterações</h2>
      <p className={P}>
        Eu posso mudar estes termos. A data no topo muda junto, e o que valia quando você aprovou uma
        proposta continua valendo para aquela proposta.
      </p>

      <h2 className={H} id="foro">12. Lei aplicável e foro</h2>
      <p className={P}>
        Lei brasileira, inclusive o Marco Civil da Internet e a LGPD. Fica eleito o foro de{" "}
        <span className={B}>Brasília, Distrito Federal</span>, para o que não se resolver por acordo.
      </p>

      <h2 className={H} id="contato">13. Contato</h2>
      <p className={P}>
        <a href={CONTACT_MAILTO} className={A}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </PaginaLegal>
  )
}
