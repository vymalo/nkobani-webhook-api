import { Test, TestingModule } from '@nestjs/testing';
import { EventSourceService } from './event-source.service';

describe('EventSourceService', () => {
  let service: EventSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSourceService],
    }).compile();

    service = module.get<EventSourceService>(EventSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
