export interface ChangeEventDetails {
  reason: string;
  event: Event;
  cancel: () => void;
  isCanceled: boolean;
}
