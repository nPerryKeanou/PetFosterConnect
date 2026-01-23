import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { ZodPipe } from "../common/pipes/zod.pipe";
import { BookMarksService } from "./bookmarks.service";
// On importe le Schéma (pour la validation) et le Type (pour TypeScript)
import { CreateBookmarkSchema, type CreateBookmarkDto } from "@projet/shared-types";

@Controller("bookmarks")
export class BookmarksController {
  constructor(private readonly bookmarksService: BookMarksService) {}

  @UseGuards(JwtAuthGuard)
  @Post("toggle")
  // Le ZodPipe fait le travail de validation à la place des Class-Validators
  @UsePipes(new ZodPipe(CreateBookmarkSchema))
  async toggle(
    @Req() req: any, 
    @Body() dto: CreateBookmarkDto // Ici 'dto' est juste un objet typé par Zod
  ) {
    // req.user.id est récupéré via ton cookie par la JwtStrategy
    return this.bookmarksService.toggle(req.user.id, dto.animalId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMyBookmarks(@Req() req: any) {
    return this.bookmarksService.findAllByUser(req.user.id);
  }
}