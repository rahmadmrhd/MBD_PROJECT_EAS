export default class PageError extends Error {
  status: number;
  title: string | null;
  constructor(status: number, title: string | null, message: string) {
    super(message);
    this.status = status;
    this.title = title;
  }
}
