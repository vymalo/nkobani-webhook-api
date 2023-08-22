import { Test, TestingModule } from '@nestjs/testing';
import { RemoteSchemaResolver } from './remote-schema.resolver';

describe('RemoteSchemaResolver', () => {
  let resolver: RemoteSchemaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoteSchemaResolver],
    }).compile();

    resolver = module.get<RemoteSchemaResolver>(RemoteSchemaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
