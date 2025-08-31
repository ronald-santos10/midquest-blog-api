import axios from "axios";

export const lifecycles = {
  async afterCreate(event) {
    const post = event.result;

    try {
      const listId = 3; 
      const contactsResponse = await axios.get(
        `https://api.brevo.com/v3/contacts?listIds=${listId}`,
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
          }
        }
      );

      const contacts = contactsResponse.data.contacts.map(contact => contact.email);
      console.log(`Encontrados ${contacts.length} contatos.`)

      console.log('Iniciando o envio do evento "new_post" para cada contato...');
      
      for (const email of contacts) {
        await axios.post(
          "https://api.brevo.com/v3/events",
          {
            eventName: "new_post",
            email: email, 
            properties: {
              title: post.title,
              slug: post.slug,
              url: `${process.env.SITE_DOMAIN}/posts/${post.slug}`
            }
          },
          {
            headers: {
              "api-key": process.env.BREVO_API_KEY,
              "Content-Type": "application/json"
            }
          }
        );
        console.log(`Evento enviado para: ${email}`);
      }

      console.log('Envio de eventos concluído.');

    } catch (error) {
      console.error('Falha ao processar o envio dos eventos.');
      if (error.response) {
        console.error('Status do Erro:', error.response.status);
        console.error('Resposta do Erro:', error.response.data);
      } else if (error.request) {
        console.error('Sem resposta do servidor. Requisição:', error.request);
      } else {
        console.error('Erro de Configuração:', error.message);
      }
    }
  },
};