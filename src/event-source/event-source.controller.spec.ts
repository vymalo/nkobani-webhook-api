import { Test, TestingModule } from '@nestjs/testing';
import { EventSourceController } from './event-source.controller';

describe('EventSourceController', () => {
  let controller: EventSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventSourceController],
    }).compile();

    controller = module.get<EventSourceController>(EventSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
