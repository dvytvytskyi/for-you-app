import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UserDevice } from '../database/entities/user-device.entity';
import { NotificationSettings } from '../database/entities/notification-settings.entity';
import { NotificationHistory } from '../database/entities/notification-history.entity';
import { FirebaseModule } from '../integrations/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDevice, NotificationSettings, NotificationHistory]),
    FirebaseModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

