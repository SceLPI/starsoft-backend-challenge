import { Status } from 'src/domain/enums/Status';

export interface UpdateOrderUseCaseParams {
  id: string;
  status: Status;
}
