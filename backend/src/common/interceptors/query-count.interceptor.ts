import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { StatusService } from '../../status/status.service';

@Injectable()
export class QueryCountInterceptor implements NestInterceptor {
  constructor(private readonly statusService: StatusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.method === 'GET') {
      this.statusService.incrementQueryCount();
    }

    return next.handle();
  }
}

