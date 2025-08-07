import { IsIn } from 'class-validator';
import { Status } from 'src/domain/enums/Status';

export class UpdateOrderDTO {
  @IsIn(Object.values(Status), {
    message: `status must be one of: ${Object.values(Status).join(', ')}`,
  })
  status: Status;
}
