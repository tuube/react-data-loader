export interface HelloInput {
  input: string;
}

export function hello(input: HelloInput): string {
  return `Hello ${input.input}`;
}