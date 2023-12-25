import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { AuthRequest } from 'src/auth/types/authRequest.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>, private readonly dataSource: DataSource, private readonly jwtService: JwtService) {}

  async signup(createUserDto: UserSignupDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    createUserDto.password = await hash(createUserDto.password, 10);

    if (await this.UserExist(createUserDto.email)) throw new BadRequestException('Email Already Exists');

    try {
      const user = this.userRepo.create(createUserDto);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      delete user.password;
      return { user: user };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error occured while registering');
    } finally {
      await queryRunner.release();
    }
  }

  async signin(signinUser: UserSignInDto) {
    if (!(await this.UserExist(signinUser.email))) throw new BadRequestException('Email does not exists');
    const user = await this.userRepo.createQueryBuilder('users').addSelect('users.password').where('users.email=:email', {email: signinUser.email}).getOne(); 
    const matchedPass = await compare(signinUser.password, user.password); 
    if (!matchedPass) throw new BadRequestException('Password is incorrect');
    delete user.password;
    return user;
  }

  async findAll() {
    const users = await this.userRepo.find({ select: {
      id: true,
      name: true,
      email: true,
      role: true
    }});

    return { users: users }
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({
      where: {id},
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
  }

  // Not working properly
  async update(id: number, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, email, password } = updateUserDto;

      const user = await this.userRepo.findOneBy({
        id: id,
      });
      
      if(name) {
        user.name = name;
      } else if (email) {
        user.email = email;
      } else if (password) {
        user.password = password;
      }

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction()
      return { user: user };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    return await this.userRepo.delete(id);
  }

  async UserExist(email: string) {
    return await this.userRepo.findOneBy({email});
  }

  async currentUser(request: AuthRequest) {
    const token=request.headers.authorization.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET,
    });
    const { email } = payload;
    return await this.UserExist(email);
  }
}