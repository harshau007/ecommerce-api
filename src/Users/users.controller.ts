import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: UserSignupDto) {
    return await this.usersService.signup(createUserDto);
  }

  @Post('signin')
  async signin(@Body() signinUserDto: UserSignInDto, @Res() response: Response) {
    const user = await this.usersService.signin(signinUserDto);
    const accessToken = await this.authService.accessToken(user.email, user.id);

    response.set('Authorization', 'Bearer ' + accessToken);
    response.cookie('Authorization', 'Bearer ' + accessToken, {httpOnly: true, secure: true});

    response.send({ user: user, accessToken: accessToken });
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
