export class CreateCourtDto {
  name: string;
  typeId: number;
  statusId: number;
}

export class UpdateCourtDto {
  name?: string;
  typeId?: number;
  statusId?: number;
}
