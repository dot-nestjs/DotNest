export class StandardResult<T> {
  data: T;
  status: number;
  errorMessages: string | null;
}
