import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';

describe('StatusService', () => {
  let service: StatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusService],
    }).compile();

    service = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return uptime in seconds', () => {
    const uptime = service.getUptime();
    expect(uptime).toBeGreaterThanOrEqual(0);
  });

  it('should increment query count', () => {
    const initialCount = service.getQueryCount();
    service.incrementQueryCount();
    expect(service.getQueryCount()).toBe(initialCount + 1);
  });

  it('should return status with uptime and queryCount', () => {
    service.incrementQueryCount();
    const status = service.getStatus();
    expect(status).toHaveProperty('uptime');
    expect(status).toHaveProperty('queryCount');
    expect(status.queryCount).toBeGreaterThanOrEqual(1);
  });
});

