export default ({ env }: { env: (key: string, defaultValue?: string) => string }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-brevo',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'), // sua chave API da Brevo
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'no-reply@meudominio.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'contato@meudominio.com'),
      },
    },
  },
});
