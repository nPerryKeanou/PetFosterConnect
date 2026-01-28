import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendTestEmail(
    @Body() body: { to: string; subject: string; text: string; html: string }
  ) {
    console.log("📨 [EmailController] Route /emails/send appelée");
    const result = await this.emailService.sendMail(
      body.to,
      body.subject,
      body.text,
      body.html
    );
    return { message: 'Email envoyé', result };
  }
}
