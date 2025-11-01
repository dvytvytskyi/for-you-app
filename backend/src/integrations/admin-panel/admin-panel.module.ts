import { Module } from '@nestjs/common';
import { AdminPanelClient } from './admin-panel.client';

@Module({
  providers: [AdminPanelClient],
  exports: [AdminPanelClient],
})
export class AdminPanelModule {}
