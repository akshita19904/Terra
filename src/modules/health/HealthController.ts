import { Request, Response } from 'express';
import { BaseController } from '../../shared/infrastructure/http/BaseController';
import { HealthService } from './HealthService';

export class HealthController extends BaseController {
  private healthService: HealthService;

  constructor() {
    super();
    this.healthService = new HealthService();
  }

  public async executeImpl(_req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.healthService.getHealthStatus();
      if (result.status === 'DOWN') {
        return res.status(503).json(result);
      }
      return this.ok(res, result);
    } catch (error) {
      return this.fail(res, error as Error);
    }
  }
}
