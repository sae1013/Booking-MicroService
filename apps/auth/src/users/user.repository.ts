import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common/database';
import { UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
