import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeAll(() => {
    service = new EmailService();
  });

  it('envoie un email de test', async () => {
    const result = await service.sendMail(
      'test@test.com',
      'Sujet de test',
      'Texte brut',
      '<p>HTML de test</p>'
    );

    expect(result).toBeDefined();
    expect(result.messageId).toBeDefined();
  });
});
