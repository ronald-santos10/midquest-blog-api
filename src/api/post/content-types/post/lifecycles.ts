import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY as string;
const site = process.env.SITE_DOMAIN as string;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const lifecycles = {
  async afterUpdate(event: any) {
    const { result, previousResult } = event;

    if (result.publishedAt && !previousResult.publishedAt) {
      strapi.log.info("🚀 Post publicado, disparando email...");

      const listId = 3;
      const templateId = 1;

      const sendSmtpEmail: SibApiV3Sdk.SendSmtpEmail = {
        sender: { email: process.env.EMAIL_FROM, name: "Midquest" },
        templateId,
        listIds: [listId],
        params: {
          title: result.title,
          description: result.description,
          link: `${site}/post/${result.slug}`,
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
    }
  },
};

export default lifecycles;
