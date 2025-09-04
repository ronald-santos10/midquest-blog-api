import SibApiV3Sdk from "sib-api-v3-sdk";

// Configuração do cliente Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY as string;
const site = process.env.SITE_DOMAIN_BLOG as string;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const lifecycles = {
  async afterCreate(event: any) {
    strapi.log.info("🚀 Lifecycle afterCreate disparado");
    strapi.log.info(event.result);
    const { result } = event;

    const listId = 3;
    const templateId = 1;

    const sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail = {
      sender: { email: process.env.EMAIL_FROM, name: "Midquest" },
      templateId,
      listIds: [listId],
      params: {
        title: result.title,
        description: result.description,
        link: `${site}/${result.slug}`,
      },
    };

    try {
      await tranEmailApi.sendTransacEmail(sendSmtpEmail);
      strapi.log.info(
        `📧 Email via template ${templateId} enviado para lista ${listId}`
      );
    } catch (err) {
      strapi.log.error("Erro ao enviar email:", err);
    }
  },
};

export default lifecycles;
