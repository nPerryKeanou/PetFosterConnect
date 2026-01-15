// src/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterSchema, type RegisterDto } from "@projet/shared-types";
import { ZodPipe } from "../common/pipes/zod.pipe";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UsePipes(new ZodPipe(RegisterSchema))
    create(@Body() body: RegisterDto) {
    return this.usersService.create(body);
    }

    @Get()
    findAll() {
    return this.usersService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
    return this.usersService.findOne(Number(id));
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() body: any) {
    return this.usersService.update(Number(id), body);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
    }
}
