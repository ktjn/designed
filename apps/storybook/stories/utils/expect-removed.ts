import { waitForElementToBeRemoved } from "storybook/test";

/**
 * Some overlay popups (Popover) unmount synchronously with no closing
 * transition; others (Menu) stay mounted with data-closed/data-ending-style
 * during a transition before actually unmounting. `waitForElementToBeRemoved`
 * throws immediately if the element is already gone at call time, so check
 * presence first rather than assuming either timing.
 */
export async function expectEventuallyRemoved(
  getElement: () => HTMLElement | null,
) {
  if (getElement()) {
    await waitForElementToBeRemoved(getElement);
  }
}
