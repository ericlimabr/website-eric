// O endereço que APARECE no site. Quando a caixa do domínio estiver de pé ele
// passa a receber de verdade; até lá quem escreve direto para ele não chega.
export const CONTACT_EMAIL = "contato@ericlima.com.br"
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`

export const CONTACT_DATA = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: CONTACT_MAILTO,
    prefix: "01",
  },
  {
    label: "GitHub",
    value: "github.com/ericlimabr",
    href: "https://github.com/ericlimabr",
    prefix: "02",
    target: "_blank",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ericlimadf",
    href: "https://www.linkedin.com/in/ericlimadf/",
    prefix: "03",
    target: "_blank",
  },
]

// Para onde o aviso de um envio novo é entregue hoje. Nunca vai para a página.
export const CONTACT_NOTIFY_FALLBACK = "gestaoadverb@gmail.com"
