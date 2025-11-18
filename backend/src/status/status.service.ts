import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  private readonly startTime: Date;
  private queryCount: number = 0;

  constructor() {
    this.startTime = new Date();
  }

  getUptime(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.startTime.getTime()) / 1000); // em segundos
  }

  incrementQueryCount(): void {
    this.queryCount++;
  }

  getQueryCount(): number {
    return this.queryCount;
  }

  getStatus() {
    return {
      uptime: this.getUptime(),
      queryCount: this.getQueryCount(),
    };
  }
}

