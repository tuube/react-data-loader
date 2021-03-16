
function generateId() {
  return "id";
}

export default class Subscriber {
  id: string;

  constructor() {
    this.id = generateId();
  }
}